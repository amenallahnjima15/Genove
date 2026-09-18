"""
Agent Base de Données (PostgreSQL)
------------------------------------------------------------------
Rôle : quand l'Agent de Routage détermine que la question porte sur
des données STRUCTURÉES du site (formations, projets, etc.),
interroger PostgreSQL et retourner un résultat structuré.

Entrée  : la question utilisateur.
Sortie  : un DatabaseResult (lignes récupérées, description de la
          requête exécutée, erreur éventuelle), transmis à l'Agent
          de Synthèse.

Ne remplace PAS ChromaDB / le RAG : PostgreSQL est réservé aux
données structurées, ChromaDB reste dédié à la recherche sémantique
documentaire — les deux systèmes coexistent (voir database.py et
agents/retrieval_agent.py).
"""

import re
from dataclasses import dataclass, field

import database


@dataclass
class DatabaseResult:
    rows: list[dict] = field(default_factory=list)
    query_description: str = ""
    has_results: bool = False
    error: str | None = None


MOTS_COMPTAGE = ["combien", "nombre de"]


def query_database(question: str) -> DatabaseResult:
    """
    Interroge PostgreSQL en fonction du contenu de la question.

    Aujourd'hui, une seule table est disponible (formations), donc
    toute question routée vers "database" est traitée comme portant
    sur les formations. Quand d'autres tables seront ajoutées
    (projects, users...), cette fonction pourra les distinguer de
    la même façon (mots-clés déclencheurs + éventuellement l'intent
    déterminé par l'Agent de Routage).

    Ne lève jamais d'exception vers l'appelant : les erreurs de
    connexion/requête sont capturées dans le champ `error`.
    """

    question_normalisee = question.lower()

    try:
        if any(mot in question_normalisee for mot in MOTS_COMPTAGE):
            nombre = database.compter_formations()
            return DatabaseResult(
                rows=[{"nombre_formations": nombre}],
                query_description="COUNT(*) FROM formations",
                has_results=True,
            )

        # On cherche si un mot significatif du titre d'une formation
        # apparaît dans la question (ex: "React" dans "quelle est la
        # durée de la formation React ?"), pour cibler la recherche.
        # Sinon, on retourne toutes les formations disponibles.

        formations = database.lister_formations()

        terme_trouve = None

        for formation in formations:
            mots_titre = re.findall(r"\w+", formation["title"].lower())
            if any(len(mot) > 3 and mot in question_normalisee for mot in mots_titre):
                terme_trouve = formation["title"]
                break

        if terme_trouve:
            resultats = database.rechercher_formations(terme_trouve)
            return DatabaseResult(
                rows=resultats,
                query_description=(
                    f"SELECT * FROM formations WHERE title/description ILIKE "
                    f"'%{terme_trouve}%'"
                ),
                has_results=bool(resultats),
            )

        return DatabaseResult(
            rows=formations,
            query_description="SELECT * FROM formations",
            has_results=bool(formations),
        )

    except Exception as erreur:
        return DatabaseResult(error=f"Erreur PostgreSQL : {erreur}")
