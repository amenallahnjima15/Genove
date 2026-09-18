"""
API FastAPI - Chatbot RAG multi-agents
--------------------------------------------------------
Point d'entrée de l'API Genove. Assemble l'application FastAPI
(CORS, initialisation PostgreSQL au démarrage) et branche les
routes définies dans routes/chat.py.

Pipeline appelé (voir routes/chat.py -> agents/orchestrator.py) :

    Question (reçue du frontend)
       ↓
    process_question() (agents/orchestrator.py)
       ↓
    Agent de Routage -> Agent de Recherche -> Agent de Synthèse
       ↓
    Réponse renvoyée en JSON

Le contrat de l'API (POST /chat, { "question": "..." } ->
{ "reponse": "..." }) est inchangé : le frontend existant continue
de fonctionner sans aucune modification.

Lancement (depuis le dossier Backend/) :

    uvicorn main:app --reload

Ollama doit être lancé en parallèle (ollama serve),
et l'index ChromaDB doit déjà exister
(`python -m rag.indexation` doit avoir été lancé au moins une fois).

L'API sera accessible sur : http://localhost:8000
Documentation interactive : http://localhost:8000/docs
"""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import database
from routes.chat import router as chat_router


logger = logging.getLogger("genove.api")


# =========================================================
# CONFIGURATION
# =========================================================

app = FastAPI(
    title="Chatbot RAG API",
    description="API qui répond aux questions en se basant "
                 "sur les documents indexés (ex: CV) et sur les "
                 "données structurées PostgreSQL, via une "
                 "architecture multi-agents (routage, recherche, "
                 "base de données, synthèse).",
    version="3.0"
)


@app.on_event("startup")
def initialiser_base_de_donnees() -> None:
    """
    Crée la table `formations` si besoin et insère les données de
    démonstration au premier démarrage (voir database/connection.py).

    Non bloquant : si PostgreSQL est indisponible, l'API démarre
    quand même — les questions routées vers "database" échoueront
    proprement (message utilisateur clair) tant que PostgreSQL
    n'est pas accessible, mais le RAG (ChromaDB) continue de
    fonctionner normalement.
    """

    try:
        database.init_db()
        logger.info("PostgreSQL initialisé (table 'formations' prête).")
    except Exception as erreur:
        logger.warning(
            "PostgreSQL indisponible au démarrage (%s) — les questions "
            "routées vers la base de données échoueront proprement "
            "jusqu'à ce qu'il soit accessible.",
            erreur,
        )


# Origines autorisées à appeler cette API depuis le navigateur.
# En développement, on autorise les ports habituels de React/Vite.
# En production, remplace "*" par l'URL exacte de ton site web.

ORIGINES_AUTORISEES = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINES_AUTORISEES,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# ROUTES (voir routes/chat.py)
# =========================================================

app.include_router(chat_router)
