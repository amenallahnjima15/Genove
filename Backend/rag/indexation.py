"""
Objectif : indexer les chunks et leurs embeddings
dans ChromaDB.

Pipeline :

    PDF
     ↓
    Extraction
     ↓
    Chunking (par section)
     ↓
    Embeddings
     ↓
    Indexation ChromaDB
     ↓
    Semantic Search

------------------------------------------------------------------
CORRECTIFS :

1. On utilise decouper_par_sections() au lieu du découpage
   par taille fixe (voir text_chunking.py).

2. On ajoute un chunk d'IDENTITÉ explicite (nom de la personne),
   pris sur la première ligne non vide du PDF. Cette info est
   courte et unique : elle a plus de chances d'être mal retrouvée
   par la recherche sémantique qu'un chunk mélangé au reste. En
   l'indexant à part avec une formulation explicite, on augmente
   fortement les chances qu'elle remonte pour une question du type
   "quel est mon nom ?" / "comment je m'appelle ?".
"""

import chromadb

from .lire_pdf import lire_pdf_en_texte

from .text_chunking import decouper_par_sections

from .embeddings import creer_embeddings

from .config import DOSSIER_CHROMA, NOM_COLLECTION, CHEMIN_CV_DEMO


def extraire_chunk_identite(texte: str) -> str | None:
    """
    Construit un chunk dédié contenant le nom de la personne,
    à partir de la première ligne non vide du texte extrait
    (dans un CV, c'est en général le nom complet).

    Retourne None si aucune ligne exploitable n'est trouvée.
    """

    for ligne in texte.splitlines():

        ligne = ligne.strip()

        if ligne:

            return (
                f"Identité :\nNom complet de la personne : {ligne}"
            )

    return None


def indexer_dans_chromadb(
    chunks: list[str],
    embeddings: list[list[float]],
    nom_fichier: str
) -> None:
    """
    Stocke les chunks et leurs embeddings
    dans ChromaDB.
    """

    print(
        "\n=== Connexion à ChromaDB ==="
    )

    client = chromadb.PersistentClient(
        path=DOSSIER_CHROMA
    )

    collection = client.get_or_create_collection(
        name=NOM_COLLECTION
    )

    ids = []

    metadatas = []

    for numero in range(
        len(chunks)
    ):

        ids.append(
            f"chunk_{numero + 1}"
        )

        metadatas.append(
            {
                "source": nom_fichier,
                "chunk": numero + 1
            }
        )

    print(
        "\n=== Indexation ===\n"
    )

    collection.upsert(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas
    )

    print(
        f"{len(chunks)} chunks indexés "
        f"avec succès."
    )

    nombre_total = collection.count()

    print(
        f"Nombre total de chunks dans "
        f"ChromaDB : {nombre_total}"
    )


if __name__ == "__main__":

    print(
        "=========================================="
    )

    print(
        "       INDEXATION CHROMADB"
    )

    print(
        "==========================================\n"
    )

    chemin_pdf = CHEMIN_CV_DEMO

    try:

        # -------------------------------------------------
        # EXTRACTION
        # -------------------------------------------------

        print(
            "=== Extraction du PDF ===\n"
        )

        texte_complet = lire_pdf_en_texte(
            chemin_pdf
        )

        print(
            f"Texte extrait : "
            f"{len(texte_complet)} caractères.\n"
        )

        # -------------------------------------------------
        # CHUNKING PAR SECTION
        # -------------------------------------------------

        print(
            "=== Chunking (par section) ===\n"
        )

        chunks = decouper_par_sections(
            texte_complet
        )

        # Ajout du chunk d'identité en tête de liste.

        chunk_identite = extraire_chunk_identite(
            texte_complet
        )

        if chunk_identite:

            chunks.insert(
                0,
                chunk_identite
            )

        print(
            f"Nombre de chunks : "
            f"{len(chunks)}\n"
        )

        # -------------------------------------------------
        # EMBEDDINGS
        # -------------------------------------------------

        print(
            "=== Création des embeddings ===\n"
        )

        embeddings = creer_embeddings(
            chunks
        )

        print(
            "\nEmbeddings créés avec succès.\n"
        )

        # -------------------------------------------------
        # INDEXATION
        # -------------------------------------------------

        indexer_dans_chromadb(
            chunks,
            embeddings,
            chemin_pdf
        )

        print(
            "\n=========================================="
        )

        print(
            "     INDEXATION TERMINÉE AVEC SUCCÈS"
        )

        print(
            "=========================================="
        )

    except FileNotFoundError:

        print(
            f"Erreur : le fichier "
            f"'{chemin_pdf}' est introuvable."
        )

    except Exception as erreur:

        print(
            f"Une erreur est survenue : "
            f"{erreur}"
        )
