"""
Package "agents" — Architecture multi-agents de Genove.

Trois agents, chacun avec une responsabilité unique :

    routing_agent.py    -> Agent de Routage      (détermine l'intention)
    retrieval_agent.py  -> Agent de Recherche     (interroge ChromaDB via le RAG existant)
    synthesis_agent.py  -> Agent de Synthèse      (génère la réponse avec Qwen3)

orchestrator.py assemble les trois agents dans un seul workflow,
appelé par l'API FastAPI (api.py) via process_question().
"""

from .orchestrator import process_question

__all__ = ["process_question"]
