"""
Agent de Routage
------------------------------------------------------------------
Rôle : analyser la requête utilisateur et déterminer :
  1. son intention "métier" (formation, projet, actualité, FAQ...),
     conservée pour la journalisation et la traçabilité ;
  2. sa ROUTE de traitement : "database", "rag", "both" ou
     "general", qui décide quelle(s) source(s) interroger.

Entrée  : la question posée par l'utilisateur (str).
Sortie  : un RoutingResult structuré, transmis à l'orchestrateur.

Cet agent ne génère JAMAIS la réponse finale et n'interroge jamais
lui-même PostgreSQL ou ChromaDB : il décide seulement QUI doit le
faire.

------------------------------------------------------------------
COMMENT LA ROUTE EST DÉCIDÉE (pas un simple if/elif de mots-clés) :

1. Détection rapide des salutations / formules de politesse
   ("salut", "merci"...) -> route "general" immédiate, sans
   consulter ni PostgreSQL ni ChromaDB (aucun appel inutile).

2. Scoring : la question est comparée à deux listes de signaux
   (DATABASE_SIGNALS / RAG_SIGNALS). Chaque liste contribue un
   score. Contrairement à une chaîne de if/elif qui s'arrête au
   premier match, TOUS les signaux sont évalués, ce qui permet de
   détecter une question qui mélange les deux besoins ("both").

3. Repli LLM : si aucun signal net ne se dégage (score nul des deux
   côtés), la classification n'est pas laissée au hasard ni forcée
   par défaut sur une route arbitraire : un appel LLM léger
   (Qwen3, réponse JSON stricte) tranche en analysant le SENS réel
   de la question. Ce repli ne se déclenche que pour les cas
   ambigus (voir contrainte de performance : pas d'appel LLM
   systématique).
"""

import json
import re
from dataclasses import dataclass, field

import requests

from rag import URL_OLLAMA, MODELE_LLM


@dataclass
class RoutingResult:
    intent: str
    strategy: str
    route: str  # "database" | "rag" | "both" | "general"
    route_reason: str = ""
    matched_keywords: list[str] = field(default_factory=list)


# -------------------------------------------------------------
# 1. Intention "métier" (conservée telle quelle : journalisation)
# -------------------------------------------------------------

INTENT_KEYWORDS: dict[str, list[str]] = {
    "formation": [
        "formation", "formations", "cours", "module", "modules",
        "apprendre", "certification", "certifications",
        "e-learning", "elearning", "parcours",
    ],
    "projet": [
        "projet", "projets", "proposer un projet", "réalisation",
    ],
    "actualite": [
        "actualité", "actualités", "actualites", "news",
        "nouveauté", "nouveautés", "annonce", "annonces",
    ],
    "faq": [
        "comment", "pourquoi", "qu'est-ce que", "c'est quoi",
        "aide", "fonctionnement", "comment ça marche",
    ],
}

DEFAULT_INTENT = "document"
DEFAULT_STRATEGY = "document_retrieval"


# -------------------------------------------------------------
# 2. Signaux de routage DATABASE vs RAG (scoring, pas un if/elif)
# -------------------------------------------------------------

DATABASE_SIGNALS = [
    "formation", "formations", "durée", "duree",
    "combien", "liste", "lister", "disponible", "disponibles",
    "prix", "tarif", "cours", "module", "date", "inscription",
    "catalogue", "nombre de",
    # Signaux "projet" volontairement en expressions précises (et non
    # le simple mot "projet", trop générique : il apparaît aussi dans
    # des questions RAG comme "le projet Genove", "l'architecture du
    # projet"), pour éviter les faux positifs avec le RAG.
    "projets disponibles", "projet disponible", "liste des projets",
    "quels projets", "quels sont les projets", "projets en cours",
    "informations sur ce projet", "informations sur le projet",
    "proposer un projet",
]

RAG_SIGNALS = [
    "technologie", "technologies", "architecture", "fonctionne",
    "fonctionnement", "explique", "expliquer", "document",
    "système", "systeme", "pipeline", "conception", "pourquoi",
    "contenu", "chatbot", "multi-agent", "multi-agents", "rag",
    "chromadb", "qwen", "ollama",
    # Questions d'identité / profil personnel : répondent au chunk
    # d'identité créé par rag/indexation.py (nom extrait du CV).
    # Sans ces signaux, ces questions n'ont aucun mot-clé net et
    # tombent dans le repli LLM, qui les classe à tort en "general"
    # (voir CLASSIFICATION_PROMPT) au lieu d'interroger le RAG.
    "mon nom", "je m'appelle", "qui suis-je", "qui je suis",
    "mon identité", "mon profil", "mon cv", "mes compétences",
    "mon expérience", "mon parcours", "mes coordonnées",
]

GENERAL_PATTERNS = [
    "salut", "bonjour", "bonsoir", "hello", "hi", "coucou",
    "merci", "ça va", "comment vas-tu", "au revoir", "bye",
]


def _mots_trouves(question_lower: str, signaux: list[str]) -> list[str]:
    return [s for s in signaux if s in question_lower]


CLASSIFICATION_PROMPT = """Tu es un classifieur de requêtes pour un chatbot. Réponds UNIQUEMENT avec un objet JSON, sans aucun texte autour, sans balises.

Catégories possibles :
- "database" : la question porte sur des données structurées du site (liste de formations, nombre de formations, durée, prix, projets disponibles...)
- "rag" : la question porte sur du contenu documentaire indexé — cela inclut aussi bien les explications techniques (technologies, architecture, fonctionnement du système) QUE les informations personnelles contenues dans les documents indexés (ex : CV), comme le nom, l'identité, les compétences ou l'expérience de la personne
- "both" : la question nécessite les deux à la fois
- "general" : salutation, remerciement, ou question hors sujet (qui ne porte ni sur les données du site, ni sur le contenu des documents indexés)

Exemples :
"Quel est mon nom ?" -> {{"route": "rag"}}
"Quelles sont mes compétences ?" -> {{"route": "rag"}}
"Salut, ça va ?" -> {{"route": "general"}}

Question : "{question}"

Réponds EXACTEMENT sous cette forme, rien d'autre : {{"route": "database"}}
"""


def _classifier_avec_llm(question: str) -> tuple[str, str]:
    """
    Repli utilisé uniquement quand le scoring par mots-clés est
    inconclusif (aucun signal net). Retourne (route, raison).
    Ne lève jamais d'exception : repli sûr sur "rag" en cas d'échec
    (comportement historique du système avant l'ajout de PostgreSQL).
    """

    try:
        payload = {
            "model": MODELE_LLM,
            "prompt": CLASSIFICATION_PROMPT.format(question=question),
            "stream": False,
        }
        reponse_http = requests.post(URL_OLLAMA, json=payload, timeout=30)
        reponse_http.raise_for_status()

        texte_brut = reponse_http.json().get("response", "").strip()

        correspondance = re.search(r'"route"\s*:\s*"(\w+)"', texte_brut)
        route = correspondance.group(1).lower() if correspondance else "rag"

        if route not in ("database", "rag", "both", "general"):
            route = "rag"

        return route, "classification LLM (aucun signal de mots-clés net détecté)"

    except Exception:
        return "rag", "échec de la classification LLM — repli par défaut sur RAG"


def _decider_route(question: str) -> tuple[str, str]:
    """
    Détermine la route de traitement. Retourne (route, raison).
    """

    q = question.lower().strip()

    # 1. Salutations / politesse : route directe, sans requête inutile
    #    à PostgreSQL ou ChromaDB.
    if len(q.split()) <= 5 and any(p in q for p in GENERAL_PATTERNS):
        return "general", "salutation ou formule de politesse détectée"

    # 2. Scoring des deux familles de signaux (évalués tous les deux,
    #    pas de court-circuit type if/elif).
    signaux_db = _mots_trouves(q, DATABASE_SIGNALS)
    signaux_rag = _mots_trouves(q, RAG_SIGNALS)

    if signaux_db and signaux_rag:
        return "both", f"signaux base de données {signaux_db} ET documentaires {signaux_rag}"

    if signaux_db:
        return "database", f"signaux base de données détectés : {signaux_db}"

    if signaux_rag:
        return "rag", f"signaux documentaires détectés : {signaux_rag}"

    # 3. Aucun signal net -> repli sur une classification LLM réelle,
    #    fondée sur le sens de la question (pas uniquement des mots-clés).
    return _classifier_avec_llm(question)


def route_query(question: str) -> RoutingResult:
    """
    Point d'entrée de l'Agent de Routage. Retourne toujours un
    RoutingResult exploitable.
    """

    question_nettoyee = (question or "").strip()
    q_lower = question_nettoyee.lower()

    # Intention "métier" (journalisation / traçabilité)
    intent = DEFAULT_INTENT
    matched_keywords: list[str] = []

    for candidat, mots_cles in INTENT_KEYWORDS.items():
        trouves = [m for m in mots_cles if m in q_lower]
        if trouves:
            intent = candidat
            matched_keywords = trouves
            break

    route, route_reason = _decider_route(question_nettoyee)

    return RoutingResult(
        intent=intent,
        strategy=DEFAULT_STRATEGY,
        route=route,
        route_reason=route_reason,
        matched_keywords=matched_keywords,
    )


if __name__ == "__main__":
    questions_test = [
        "Quelles formations sont disponibles ?",
        "Quelle est la durée de la formation React ?",
        "Quelles technologies sont utilisées dans le projet Genove ?",
        "Comment fonctionne le système multi-agents ?",
        "Quelles formations sont disponibles et quelles technologies sont utilisées dans le projet ?",
        "Salut",
        "Merci beaucoup",
    ]

    for q in questions_test:
        resultat = route_query(q)
        print(f"'{q}'")
        print(f"  -> route={resultat.route} | intent={resultat.intent} | raison={resultat.route_reason}\n")