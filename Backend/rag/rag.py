"""
RAG - Retrieval-Augmented Generation

Pipeline :

Question
   ↓
Embedding (avec préfixe "requête")
   ↓
Semantic Search
   ↓
Context
   ↓
Qwen3:8b
   ↓
Réponse

------------------------------------------------------------------
CORRECTIFS :

1. On utilise creer_embedding_requete() au lieu de
   creer_embedding() pour la question (voir embeddings.py).

2. n_results passé de 3 à 5 par défaut, pour donner plus de
   contexte au LLM et réduire le risque de rater un chunk
   pertinent lors du retrieval.
"""

import requests
import chromadb

from .embeddings import creer_embedding_requete
from .config import DOSSIER_CHROMA, NOM_COLLECTION, URL_OLLAMA, MODELE_LLM


# =========================================================
# CONFIGURATION
# =========================================================
#
# DOSSIER_CHROMA, NOM_COLLECTION, URL_OLLAMA et MODELE_LLM sont
# désormais définis une seule fois dans config.py (voir ce fichier
# pour le détail), et simplement ré-exportés ici pour que le reste
# du code (agents/, semantic_search.py) continue de fonctionner sans
# changement : `from rag import URL_OLLAMA, MODELE_LLM` etc.


# =========================================================
# 1. RECHERCHE DES INFORMATIONS DANS CHROMADB
# =========================================================

def rechercher_contexte(
    question: str,
    nombre_resultats: int = 5
):
    """
    Recherche les chunks les plus pertinents
    dans ChromaDB.
    """

    client = chromadb.PersistentClient(
        path=DOSSIER_CHROMA
    )

    collection = client.get_collection(
        name=NOM_COLLECTION
    )

    embedding_question = creer_embedding_requete(
        question
    )

    resultats = collection.query(
        query_embeddings=[
            embedding_question
        ],
        n_results=nombre_resultats
    )

    return resultats


# =========================================================
# 2. CONSTRUCTION DU CONTEXTE
# =========================================================

def construire_contexte(
    resultats
) -> str:
    """
    Assemble les chunks récupérés
    en un seul contexte.
    """

    documents = resultats["documents"][0]

    contexte = "\n\n".join(
        documents
    )

    return contexte


# =========================================================
# 3. ENVOYER LA QUESTION + CONTEXTE À QWEN
# =========================================================

def appeler_qwen(prompt: str) -> str:
    """
    Appel bas niveau à Qwen3:8b via Ollama : envoie un prompt déjà
    construit, retourne le texte de la réponse.

    Extrait de demander_a_qwen() pour être réutilisable par d'autres
    agents (ex : agents/synthesis_agent.py) qui ont besoin de
    construire des prompts différents (ex : combinant des données
    PostgreSQL et un contexte ChromaDB), sans dupliquer l'appel HTTP
    à Ollama. Le comportement de demander_a_qwen() ci-dessous est
    inchangé : il construit son prompt puis appelle cette fonction.
    """

    payload = {
        "model": MODELE_LLM,
        "prompt": prompt,
        "stream": False
    }

    reponse_http = requests.post(
        URL_OLLAMA,
        json=payload,
        timeout=120
    )

    reponse_http.raise_for_status()

    donnees = reponse_http.json()

    return donnees["response"]


def demander_a_qwen(
    question: str,
    contexte: str
) -> str:
    """
    Envoie la question et le contexte
    au modèle Qwen3:8b via Ollama.
    """

    prompt = f"""
Tu es un assistant intelligent.

Réponds à la question de l'utilisateur
en utilisant uniquement les informations
présentes dans le contexte fourni.

Règles de réponse :

    - Réponds de façon COURTE et DIRECTE, avec juste
      l'information demandée (une phrase, voire quelques mots).
    - Ne recopie PAS des sections entières du contexte.
    - Ne liste pas des informations qui n'ont pas été demandées.
    - Exemple : si on te demande "quel est mon niveau de français ?"
      et que le contexte contient "Français C1", réponds simplement
      "Ton niveau de français est C1." et rien d'autre.

Si la réponse n'est pas présente dans le contexte,
dis clairement que l'information n'est pas disponible.

Ne crée pas d'informations qui ne sont pas
présentes dans le contexte.

Contexte :
--------------------
{contexte}
--------------------

Question :
{question}

Réponse :
"""

    return appeler_qwen(prompt)


# =========================================================
# 4. PIPELINE RAG COMPLET
# =========================================================

def search_and_answer(
    question: str
) -> str:
    """
    Pipeline RAG complet.
    """

    resultats = rechercher_contexte(
        question,
        nombre_resultats=5
    )

    contexte = construire_contexte(
        resultats
    )

    reponse = demander_a_qwen(
        question,
        contexte
    )

    return reponse


# =========================================================
# 5. PROGRAMME PRINCIPAL
# =========================================================

if __name__ == "__main__":

    print(
        "=========================================="
    )

    print(
        "              PREMIER RAG"
    )

    print(
        "==========================================\n"
    )

    try:

        client = chromadb.PersistentClient(
            path=DOSSIER_CHROMA
        )

        collection = client.get_collection(
            name=NOM_COLLECTION
        )

        nombre_chunks = collection.count()

        print(
            f"Index ChromaDB trouvé : "
            f"{nombre_chunks} chunks.\n"
        )

        question = input(
            "Pose ta question : "
        )

        if not question.strip():

            print(
                "Erreur : question vide."
            )

            exit()

        print(
            "\nRecherche des informations "
            "pertinentes..."
        )

        resultats = rechercher_contexte(
            question,
            nombre_resultats=5
        )

        contexte = construire_contexte(
            resultats
        )

        print(
            f"\nChunks récupérés : "
            f"{len(resultats['documents'][0])}"
        )

        print(
            "\nEnvoi du contexte à Qwen3:8b..."
        )

        reponse = demander_a_qwen(
            question,
            contexte
        )

        print(
            "\n=========================================="
        )

        print(
            "                 RÉPONSE"
        )

        print(
            "==========================================\n"
        )

        print(
            reponse
        )

    except requests.exceptions.ConnectionError:

        print(
            "\nErreur : impossible de se connecter "
            "à Ollama."
        )

        print(
            "Vérifie qu'Ollama est lancé."
        )

    except Exception as erreur:

        print(
            f"\nUne erreur est survenue : "
            f"{erreur}"
        )
