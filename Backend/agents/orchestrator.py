"""
Orchestrateur Multi-Agents
------------------------------------------------------------------
Assemble les agents dans un seul workflow, appelé par l'API
FastAPI (api.py) à chaque question posée par l'utilisateur.

Workflow :

    Question utilisateur
        |
        v
    Agent de Routage        (routing_agent.route_query)
        |
        +---------------+---------------+
        v               v               v
    "database"        "rag"          "both"          "general"
        |               |               |                |
        v               v               v                v
    Agent BD        Agent Recherche   BD + Recherche   (rien)
    (PostgreSQL)     (ChromaDB)       (fusionnées)
        |               |               |                |
        +---------------+---------------+----------------+
                            |
                            v
                    Agent de Synthèse
                            |
                            v
                     Réponse finale

Journalisation : chaque étape est journalisée avec des préfixes
explicites ([USER QUESTION], [ROUTER], [DATABASE], [RAG],
[SYNTHESIS]) pour pouvoir suivre exactement ce que fait le système
en lisant le terminal, sans stocker de donnée sensible superflue.
"""

import logging
import time

from .routing_agent import route_query
from .retrieval_agent import retrieve
from .database_agent import query_database
from .synthesis_agent import synthesize


logger = logging.getLogger("genove.agents")

if not logger.handlers:
    _handler = logging.StreamHandler()
    _handler.setFormatter(logging.Formatter("%(asctime)s %(message)s"))
    logger.addHandler(_handler)
    logger.setLevel(logging.INFO)


def process_question(question: str) -> dict:
    """
    Exécute le workflow multi-agents complet pour une question
    utilisateur et retourne un dictionnaire contenant la réponse
    ainsi que des informations de traçabilité.
    """

    debut = time.time()
    question_nettoyee = (question or "").strip()

    if not question_nettoyee:
        return {
            "reponse": "La question ne peut pas être vide.",
            "intent": None,
            "route": None,
            "chunks_recuperes": 0,
            "lignes_bd": 0,
            "duree_secondes": 0.0,
        }

    logger.info("[USER QUESTION]\n%s", question_nettoyee)

    # -----------------------------------------------------------
    # 1. AGENT DE ROUTAGE
    # -----------------------------------------------------------
    routing_result = route_query(question_nettoyee)
    logger.info(
        "[ROUTER]\nRoute: %s (intent=%s, raison=%s)",
        routing_result.route.upper(),
        routing_result.intent,
        routing_result.route_reason,
    )

    database_result = None
    retrieval_result = None

    # -----------------------------------------------------------
    # 2. AGENT BASE DE DONNÉES (si route "database" ou "both")
    # -----------------------------------------------------------
    if routing_result.route in ("database", "both"):
        logger.info("[DATABASE]\nQuery executed")
        database_result = query_database(question_nettoyee)
        logger.info("[DATABASE]\nResults: %d", len(database_result.rows))

    # -----------------------------------------------------------
    # 3. AGENT DE RECHERCHE DOCUMENTAIRE (si route "rag" ou "both")
    # -----------------------------------------------------------
    if routing_result.route in ("rag", "both"):
        logger.info("[RAG]\nSearching ChromaDB...")
        retrieval_result = retrieve(question_nettoyee, routing_result)
        logger.info("[RAG]\nRelevant chunks: %d", len(retrieval_result.chunks))

    # -----------------------------------------------------------
    # 4. AGENT DE SYNTHÈSE
    # -----------------------------------------------------------
    logger.info("[SYNTHESIS]\nGenerating final response...")
    reponse = synthesize(
        question_nettoyee,
        routing_result,
        retrieval_result=retrieval_result,
        database_result=database_result,
    )

    duree = round(time.time() - debut, 3)

    logger.info("[RESPONSE]\nduree=%.3fs\n%s", duree, reponse)

    return {
        "reponse": reponse,
        "intent": routing_result.intent,
        "route": routing_result.route,
        "chunks_recuperes": len(retrieval_result.chunks) if retrieval_result else 0,
        "lignes_bd": len(database_result.rows) if database_result else 0,
        "duree_secondes": duree,
    }
