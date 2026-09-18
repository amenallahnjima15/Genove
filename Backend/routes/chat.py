"""
Route /chat — Chatbot RAG multi-agents
------------------------------------------------------------------
Contient les endpoints appelés par le frontend (React). Extrait de
l'ancien api.py lors de la réorganisation du projet, sans aucun
changement de comportement : le contrat de l'API est inchangé.

    GET  /        -> vérifie que l'API tourne
    POST /chat    -> { "question": "..." } -> { "reponse": "..." }
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from agents import process_question

router = APIRouter()


# =========================================================
# SCHÉMAS DE DONNÉES (validation automatique par FastAPI)
# =========================================================

class QuestionRequest(BaseModel):
    """
    Format attendu dans le corps de la requête POST /chat.

    Exemple envoyé par le frontend :

        { "question": "Quel est mon niveau de français ?" }
    """
    question: str


class ReponseChat(BaseModel):
    """
    Format de la réponse renvoyée au frontend.
    """
    reponse: str


# =========================================================
# ROUTES
# =========================================================

@router.get("/")
def verifier_api():
    """
    Route simple pour vérifier que l'API tourne.
    Utile pour tester rapidement dans le navigateur :
    http://localhost:8000
    """

    return {
        "status": "ok",
        "message": "L'API du chatbot RAG fonctionne."
    }


@router.post("/chat", response_model=ReponseChat)
def poser_question(donnees: QuestionRequest):
    """
    Route appelée par le frontend à chaque message envoyé
    par l'utilisateur dans le chat.

    Reçoit : { "question": "..." }
    Renvoie : { "reponse": "..." }
    """

    question = donnees.question.strip()

    if not question:

        raise HTTPException(
            status_code=400,
            detail="La question ne peut pas être vide."
        )

    try:

        # Workflow multi-agents : Routage -> Recherche -> Synthèse.
        # Les agents eux-mêmes gèrent proprement les erreurs
        # attendues (Ollama non lancé, collection ChromaDB
        # introuvable, timeout, aucun chunk pertinent, etc.) en
        # renvoyant un message utilisateur clair plutôt qu'en
        # levant une exception. Le try/except ici couvre
        # uniquement les erreurs vraiment inattendues.

        resultat = process_question(
            question
        )

        return ReponseChat(
            reponse=resultat["reponse"]
        )

    except Exception as erreur:

        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors du traitement de la question : {erreur}"
        )
