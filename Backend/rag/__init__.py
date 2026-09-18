"""
Package "rag" — Pipeline RAG (Retrieval-Augmented Generation).

Regroupe : lecture PDF (lire_pdf.py), découpage en chunks
(text_chunking.py), embeddings (embeddings.py), indexation
ChromaDB (indexation.py), recherche sémantique (semantic_search.py)
et le pipeline complet question -> contexte -> réponse (rag.py).

Ce fichier ré-exporte les noms utilisés ailleurs dans le projet
(agents/, main.py) pour que des imports comme :

    from rag import URL_OLLAMA, MODELE_LLM
    from rag import rechercher_contexte, construire_contexte
    from rag import demander_a_qwen

continuent de fonctionner exactement comme avant la réorganisation
en Backend/rag/, sans avoir à modifier agents/*.py.
"""

from .rag import (
    rechercher_contexte,
    construire_contexte,
    appeler_qwen,
    demander_a_qwen,
    search_and_answer,
)
from .config import DOSSIER_CHROMA, NOM_COLLECTION, URL_OLLAMA, MODELE_LLM

__all__ = [
    "rechercher_contexte",
    "construire_contexte",
    "appeler_qwen",
    "demander_a_qwen",
    "search_and_answer",
    "DOSSIER_CHROMA",
    "NOM_COLLECTION",
    "URL_OLLAMA",
    "MODELE_LLM",
]
