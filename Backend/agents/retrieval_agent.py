"""
Agent de Recherche Documentaire
------------------------------------------------------------------
Rôle : à partir de la question utilisateur (et de l'intention
déterminée par l'Agent de Routage), retrouver les passages
pertinents dans le pipeline RAG existant.

Entrée  : la question, et le RoutingResult de l'Agent de Routage.
Sortie  : un RetrievalResult structuré (chunks, métadonnées,
          distances, contexte assemblé), transmis à l'Agent de
          Synthèse.

IMPORTANT : cet agent n'implémente AUCUNE nouvelle logique de
recherche. Il encapsule/orchestre les fonctions déjà présentes dans
rag.py (rechercher_contexte, construire_contexte), qui elles-mêmes
réutilisent embeddings.py (creer_embedding_requete) et ChromaDB.
Aucune deuxième base vectorielle, aucun pipeline parallèle.
"""

from dataclasses import dataclass, field

from .routing_agent import RoutingResult

from rag import rechercher_contexte, construire_contexte


@dataclass
class RetrievalResult:
    chunks: list[str] = field(default_factory=list)
    metadatas: list[dict] = field(default_factory=list)
    distances: list[float] = field(default_factory=list)
    contexte: str = ""
    has_results: bool = False
    error: str | None = None


def retrieve(
    question: str,
    routing_result: RoutingResult,
    nombre_resultats: int = 5,
) -> RetrievalResult:
    """
    Interroge le pipeline RAG existant (ChromaDB) pour récupérer
    les chunks les plus pertinents pour la question.

    Gère proprement les cas d'erreur (collection ChromaDB absente,
    erreur d'embedding, etc.) sans jamais lever d'exception vers
    l'appelant : le résultat contient un champ `error` explicite à
    la place.
    """

    try:
        resultats = rechercher_contexte(question, nombre_resultats=nombre_resultats)
    except Exception as erreur:
        return RetrievalResult(
            error=f"Erreur lors de la recherche documentaire : {erreur}"
        )

    documents = (resultats.get("documents") or [[]])[0]
    metadatas = (resultats.get("metadatas") or [[]])[0]
    distances = (resultats.get("distances") or [[]])[0]

    if not documents:
        return RetrievalResult(has_results=False)

    contexte = construire_contexte(resultats)

    return RetrievalResult(
        chunks=documents,
        metadatas=metadatas,
        distances=distances,
        contexte=contexte,
        has_results=True,
    )
