"""
Agent de Synthèse
------------------------------------------------------------------
Rôle : à partir de la question, de la route choisie par l'Agent de
Routage, et des données récupérées (PostgreSQL et/ou ChromaDB via
le RAG), générer la réponse finale avec Qwen3 (via Ollama).

Entrée  : la question, le RoutingResult, un DatabaseResult
          optionnel (si route "database"/"both") et un
          RetrievalResult optionnel (si route "rag"/"both").
Sortie  : la réponse finale (str), destinée à l'utilisateur.

RÈGLE FONDAMENTALE : la réponse doit être fondée PRIORITAIREMENT
sur les données/contexte récupérés, quelle que soit la source
(PostgreSQL, ChromaDB, ou les deux). L'agent n'invente jamais
d'informations absentes. Pour la route "both", les deux sources
sont clairement fusionnées dans le contexte transmis au LLM, afin
que la réponse s'appuie sur l'ensemble.

Pour la route "general" (salutation, remerciement...), aucune
donnée factuelle n'est nécessaire : l'agent répond directement,
sans appeler PostgreSQL, ChromaDB, ni même le LLM (économie d'appel
inutile — voir contrainte de performance de la mission).
"""

import requests

from .routing_agent import RoutingResult
from .retrieval_agent import RetrievalResult
from .database_agent import DatabaseResult

from rag import demander_a_qwen


MESSAGE_INFO_INTROUVABLE = (
    "Je n'ai pas trouvé cette information dans les sources disponibles."
)

MESSAGE_ERREUR_RECHERCHE = (
    "Une erreur est survenue lors de la recherche documentaire. "
    "Merci de réessayer dans quelques instants."
)

MESSAGE_ERREUR_BASE_DE_DONNEES = (
    "Une erreur est survenue lors de l'accès à la base de données. "
    "Merci de réessayer dans quelques instants."
)

MESSAGE_ERREUR_CONNEXION_LLM = (
    "Impossible de contacter le modèle de langage. "
    "Vérifie qu'Ollama est bien lancé (commande : ollama serve)."
)

MESSAGE_ERREUR_TIMEOUT_LLM = (
    "Le modèle de langage a mis trop de temps à répondre. "
    "Merci de réessayer."
)

MESSAGE_ERREUR_LLM_GENERIQUE = (
    "Une erreur est survenue lors de la génération de la réponse. "
    "Merci de réessayer dans quelques instants."
)

REPONSES_GENERALES = {
    "remerciement": "Avec plaisir ! N'hésite pas si tu as d'autres questions.",
    "au_revoir": "À bientôt !",
    "salutation": "Bonjour ! Je suis l'assistant Genove. Comment puis-je t'aider aujourd'hui ?",
}


def _reponse_generale(question: str) -> str:
    q = question.lower()
    if "merci" in q:
        return REPONSES_GENERALES["remerciement"]
    if "au revoir" in q or "bye" in q:
        return REPONSES_GENERALES["au_revoir"]
    return REPONSES_GENERALES["salutation"]


def _formater_donnees_bd(database_result: DatabaseResult) -> str:
    """
    Transforme les lignes PostgreSQL en texte lisible, exploitable
    comme contexte par le LLM (même format d'esprit que les chunks
    ChromaDB : du texte, pas du JSON brut).
    """

    lignes_texte = []
    for row in database_result.rows:
        if "nombre_formations" in row:
            lignes_texte.append(f"Nombre total de formations : {row['nombre_formations']}.")
            continue

        titre = row.get("title", "")
        duree = row.get("duration", "")
        description = row.get("description", "")
        lignes_texte.append(f"- {titre} (durée : {duree}) : {description}")

    return "Données structurées (base de données) :\n" + "\n".join(lignes_texte)


def synthesize(
    question: str,
    routing_result: RoutingResult,
    retrieval_result: RetrievalResult | None = None,
    database_result: DatabaseResult | None = None,
) -> str:
    """
    Génère la réponse finale à partir des données disponibles.
    Ne lève jamais d'exception : retourne toujours un message
    utilisateur compréhensible, même en cas d'erreur.
    """

    if routing_result.route == "general":
        return _reponse_generale(question)

    if database_result is not None and database_result.error:
        return MESSAGE_ERREUR_BASE_DE_DONNEES

    if retrieval_result is not None and retrieval_result.error:
        return MESSAGE_ERREUR_RECHERCHE

    contexte_parties = []

    if database_result is not None and database_result.has_results:
        contexte_parties.append(_formater_donnees_bd(database_result))

    if retrieval_result is not None and retrieval_result.has_results:
        contexte_parties.append("Extraits documentaires (RAG) :\n" + retrieval_result.contexte)

    if not contexte_parties:
        return MESSAGE_INFO_INTROUVABLE

    contexte_final = "\n\n".join(contexte_parties)

    try:
        reponse = demander_a_qwen(question, contexte_final)
    except requests.exceptions.ConnectionError:
        return MESSAGE_ERREUR_CONNEXION_LLM
    except requests.exceptions.Timeout:
        return MESSAGE_ERREUR_TIMEOUT_LLM
    except Exception:
        return MESSAGE_ERREUR_LLM_GENERIQUE

    reponse = (reponse or "").strip()

    if not reponse:
        return MESSAGE_INFO_INTROUVABLE

    return reponse
