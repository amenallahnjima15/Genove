"""
Objectif : effectuer une recherche sémantique
dans ChromaDB.

Pipeline :

    Question
       ↓
    Embedding (avec préfixe "requête")
       ↓
    Recherche vectorielle
       ↓
    Chunks pertinents

------------------------------------------------------------------
CORRECTIFS :

1. On utilise creer_embedding_requete() au lieu de
   creer_embedding() pour la question : qwen3-embedding a besoin
   du préfixe d'instruction côté requête pour bien matcher avec
   les documents indexés (voir embeddings.py).

2. n_results passé de 3 à 5 par défaut : ça laisse plus de marge
   pour qu'un chunk pertinent mais pas parfaitement matché soit
   quand même récupéré.
"""

import chromadb

from .embeddings import creer_embedding_requete
from .config import DOSSIER_CHROMA, NOM_COLLECTION


def recherche_semantique(
    question: str,
    nombre_resultats: int = 5
):
    """
    Recherche les chunks les plus proches
    de la question.
    """

    print(
        "\n=== Connexion à ChromaDB ==="
    )

    client = chromadb.PersistentClient(
        path=DOSSIER_CHROMA
    )

    collection = client.get_collection(
        name=NOM_COLLECTION
    )

    print(
        "\nCréation de l'embedding "
        "de la question..."
    )

    embedding_question = creer_embedding_requete(
        question
    )

    print(
        "Recherche des chunks "
        "les plus proches..."
    )

    resultats = collection.query(
        query_embeddings=[
            embedding_question
        ],
        n_results=nombre_resultats
    )

    return resultats


def afficher_resultats(
    resultats
) -> None:
    """
    Affiche les résultats trouvés
    par la recherche sémantique.
    """

    print(
        "\n=========================================="
    )

    print(
        "       RÉSULTATS DE LA RECHERCHE"
    )

    print(
        "==========================================\n"
    )

    documents = resultats[
        "documents"
    ][0]

    distances = resultats[
        "distances"
    ][0]

    metadatas = resultats[
        "metadatas"
    ][0]

    for numero, document in enumerate(
        documents,
        start=1
    ):

        print(
            f"----- Résultat {numero} -----"
        )

        print(
            f"Distance : "
            f"{distances[numero - 1]}"
        )

        print(
            f"Source : "
            f"{metadatas[numero - 1]['source']}"
        )

        print(
            f"Chunk : "
            f"{metadatas[numero - 1]['chunk']}"
        )

        print(
            "\nTexte du chunk :\n"
        )

        print(
            document
        )

        print(
            "\n------------------------------------------\n"
        )


if __name__ == "__main__":

    print(
        "=========================================="
    )

    print(
        "          SEMANTIC SEARCH"
    )

    print(
        "==========================================\n"
    )

    try:

        client = chromadb.PersistentClient(
            path=DOSSIER_CHROMA
        )

        try:

            collection = client.get_collection(
                name=NOM_COLLECTION
            )

            nombre_chunks = collection.count()

            if nombre_chunks == 0:

                print(
                    "Erreur : la collection est vide."
                )

                print(
                    "Lance d'abord indexation.py."
                )

                exit()

            print(
                f"Index ChromaDB trouvé : "
                f"{nombre_chunks} chunks.\n"
            )

        except Exception:

            print(
                "Erreur : aucune collection "
                "ChromaDB trouvée."
            )

            print(
                "Lance d'abord indexation.py "
                "pour créer l'index."
            )

            exit()

        question = input(
            "Pose ta question : "
        )

        if not question.strip():

            print(
                "Erreur : la question est vide."
            )

        else:

            resultats = recherche_semantique(
                question,
                nombre_resultats=5
            )

            afficher_resultats(
                resultats
            )

    except Exception as erreur:

        print(
            f"\nUne erreur est survenue : "
            f"{erreur}"
        )
