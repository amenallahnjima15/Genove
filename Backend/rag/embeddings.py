"""
Objectif : prendre les chunks de texte obtenus à l'étape précédente
et transformer chaque chunk en vecteur numérique appelé "embedding".

Modèle utilisé :

    qwen3-embedding:4b

Ce modèle est installé localement avec Ollama.

------------------------------------------------------------------
CORRECTIF : qwen3-embedding est un modèle "instruction-aware".

Sa doc officielle recommande d'utiliser un format différent pour
les REQUÊTES (questions posées par l'utilisateur) et pour les
DOCUMENTS (les chunks indexés) :

    - Document : texte brut, sans préfixe.
    - Requête  : préfixée par une instruction, ex.

        "Instruct: Given a search query, retrieve relevant
        passages that answer the query.
        Query: <la question>"

Sans ce préfixe sur la requête, le vecteur de la question est
moins bien aligné avec les vecteurs des chunks pertinents, ce qui
dégrade la recherche sémantique — en particulier sur des questions
courtes et factuelles ("quel est mon nom ?", "quel est mon niveau
d'anglais ?").

=> creer_embedding()          : pour les DOCUMENTS (inchangé).
=> creer_embedding_requete()  : NOUVEAU, pour les QUESTIONS.
"""

import requests

# lire_pdf et text_chunking ne sont utilisés que par le bloc de test
# (if __name__ == "__main__") tout en bas de ce fichier. On les importe
# seulement à cet endroit, pour que embeddings.py reste utilisable
# (par rag.py / api.py) même dans un dossier qui ne contient pas
# lire_pdf.py et text_chunking.py (ex: 10_FastAPI_API).


URL_EMBED_OLLAMA = "http://localhost:11434/api/embed"

MODELE_EMBEDDING = "qwen3-embedding:4b"

INSTRUCTION_REQUETE = (
    "Instruct: Given a search query, retrieve relevant "
    "passages that answer the query.\n"
    "Query: "
)


def _appeler_ollama_embed(texte: str) -> list[float]:
    """
    Envoie un texte à Ollama et retourne son embedding.
    Fonction interne partagée par creer_embedding
    et creer_embedding_requete.
    """

    payload = {
        "model": MODELE_EMBEDDING,
        "input": texte
    }

    reponse_http = requests.post(
        URL_EMBED_OLLAMA,
        json=payload,
        timeout=120
    )

    reponse_http.raise_for_status()

    donnees = reponse_http.json()

    embedding = donnees["embeddings"][0]

    return embedding


def creer_embedding(texte: str) -> list[float]:
    """
    Transforme un morceau de texte (un CHUNK/DOCUMENT)
    en vecteur numérique.

    Pas de préfixe : c'est le format attendu côté document.
    """

    return _appeler_ollama_embed(
        texte
    )


def creer_embedding_requete(question: str) -> list[float]:
    """
    Transforme une QUESTION utilisateur en vecteur numérique,
    en utilisant le préfixe d'instruction recommandé par
    qwen3-embedding pour la recherche.

    À utiliser à la place de creer_embedding() partout où on
    embed une question posée par l'utilisateur (Semantic_Search.py,
    rag.py) — jamais pour les documents indexés.
    """

    texte_avec_instruction = (
        INSTRUCTION_REQUETE + question
    )

    return _appeler_ollama_embed(
        texte_avec_instruction
    )


def creer_embeddings(chunks: list[str]) -> list[list[float]]:
    """
    Transforme tous les chunks (documents) en embeddings.
    """

    embeddings = []

    for numero, chunk in enumerate(chunks, start=1):

        print(
            f"Création de l'embedding "
            f"{numero}/{len(chunks)}..."
        )

        embedding = creer_embedding(chunk)

        embeddings.append(embedding)

    return embeddings


def afficher_embeddings(
    chunks: list[str],
    embeddings: list[list[float]]
) -> None:
    """
    Affiche les embeddings générés dans le terminal.
    """

    print("\n=== Résultat des embeddings ===\n")

    for numero, (chunk, embedding) in enumerate(
        zip(chunks, embeddings),
        start=1
    ):

        print(
            f"----- Chunk {numero}/{len(chunks)} -----"
        )

        print("Texte :")

        print(chunk[:200])

        print(
            f"Dimension de l'embedding : "
            f"{len(embedding)}"
        )

        print("Premières valeurs du vecteur :")

        print(embedding[:10])

        print()


if __name__ == "__main__":

    from lire_pdf import lire_pdf_en_texte

    from text_chunking import decouper_par_sections

    from config import CHEMIN_CV_DEMO

    chemin_pdf = CHEMIN_CV_DEMO

    print("=== Création des embeddings ===\n")

    try:

        texte_complet = lire_pdf_en_texte(chemin_pdf)

        print(
            f"Texte extrait : "
            f"{len(texte_complet)} caractères.\n"
        )

        mes_chunks = decouper_par_sections(
            texte_complet
        )

        print(
            f"Nombre de chunks : "
            f"{len(mes_chunks)}\n"
        )

        mes_embeddings = creer_embeddings(mes_chunks)

        afficher_embeddings(
            mes_chunks,
            mes_embeddings
        )

        print(
            "=== Création des embeddings terminée ==="
        )

    except requests.exceptions.ConnectionError:

        print(
            "Erreur : impossible de se connecter à Ollama."
        )

        print(
            "Vérifie qu'Ollama est bien lancé."
        )

        print(
            "Commande possible : ollama serve"
        )

    except requests.exceptions.HTTPError as erreur:

        print(f"Erreur HTTP : {erreur}")

        print(
            "Vérifie que le modèle "
            "'qwen3-embedding:4b' est installé."
        )

        print(
            "Commande : "
            "ollama pull qwen3-embedding:4b"
        )

    except FileNotFoundError:

        print(
            f"Erreur : le fichier "
            f"'{chemin_pdf}' est introuvable."
        )

        print(
            "Vérifie que le PDF se trouve bien "
            "dans le même dossier que ce script."
        )

    except Exception as erreur:

        print(
            f"Une erreur inattendue est survenue : "
            f"{erreur}"
        )
