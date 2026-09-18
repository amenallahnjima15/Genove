"""
Étape 2 - Lecture d'un fichier PDF avec affichage page par page
------------------------------------------------------------------
Objectif : lire un PDF et afficher tout son contenu texte dans le
terminal, en montrant clairement la séparation entre les pages.

Pourquoi cette étape est importante dans un pipeline RAG :
Avant de pouvoir "chunker" (découper) un document, générer des
embeddings ou le stocker dans une base vectorielle, il faut d'abord
être capable d'EXTRAIRE le texte brut qu'il contient. C'est la toute
première brique : sans extraction fiable, tout le reste du pipeline
(chunking, embeddings, retrieval) reçoit des données incomplètes ou
mal structurées. Travailler page par page permet aussi, plus tard,
de garder une trace de la provenance de chaque chunk (ex: "ce
passage vient de la page 3"), ce qui sera très utile pour les
citations dans les réponses du RAG.
"""

# On importe la classe PdfReader depuis la bibliothèque "pypdf".
# pypdf est la version moderne et maintenue de l'ancien PyPDF2
# (PyPDF2 est aujourd'hui abandonné, pypdf est son successeur officiel).
from pypdf import PdfReader


def lire_pdf_en_texte(chemin_fichier: str) -> str:
    """
    Lit un PDF et retourne TOUT son texte concaténé en une seule
    chaîne de caractères (toutes les pages mises bout à bout).
    Utile pour les étapes suivantes du pipeline (chunking, embeddings),
    qui ont besoin du texte brut plutôt que d'un simple affichage.
    """
    lecteur = PdfReader(chemin_fichier)

    # Liste qui va accueillir le texte de chaque page.
    morceaux_de_texte = []

    for page in lecteur.pages:
        texte_page = page.extract_text()
        if texte_page:  # on ignore les pages sans texte détecté
            morceaux_de_texte.append(texte_page)

    # On assemble toutes les pages avec un saut de ligne entre elles.
    return "\n".join(morceaux_de_texte)


def lire_pdf(chemin_fichier: str):
    """
    Ouvre un PDF et affiche son contenu texte, page par page,
    dans le terminal.
    """

    # PdfReader ouvre le fichier PDF et charge sa structure interne
    # (nombre de pages, métadonnées, etc.) sans encore extraire le texte.
    lecteur = PdfReader(chemin_fichier)

    # "lecteur.pages" est une liste de toutes les pages du document.
    # On récupère le nombre total de pages pour l'affichage.
    nombre_de_pages = len(lecteur.pages)

    print(f"=== Lecture de : {chemin_fichier} ===")
    print(f"Nombre total de pages : {nombre_de_pages}\n")

    # "enumerate(..., start=1)" nous donne à la fois l'index (à partir de 1,
    # plus naturel pour l'affichage) et l'objet page correspondant.
    for numero_page, page in enumerate(lecteur.pages, start=1):

        # ".extract_text()" est la méthode qui fait le vrai travail :
        # elle analyse le contenu binaire de la page PDF et essaie
        # d'en extraire le texte lisible (lettres, mots, lignes).
        texte_page = page.extract_text()

        # Certaines pages (images scannées, pages vides) peuvent ne
        # renvoyer aucun texte. On gère ce cas pour éviter d'afficher "None".
        if texte_page is None:
            texte_page = "(Aucun texte détecté sur cette page — " \
                          "probablement une image scannée ou une page vide)"

        # Séparateur visuel clair entre chaque page dans le terminal.
        print(f"----- Page {numero_page}/{nombre_de_pages} -----")
        print(texte_page)
        print()  # ligne vide pour aérer l'affichage


# Ce bloc ne s'exécute que si on lance CE fichier directement.
if __name__ == "__main__":

    # Remplace ce chemin par le chemin réel de ton fichier PDF.
    from config import CHEMIN_CV_DEMO
    chemin_pdf = CHEMIN_CV_DEMO

    try:
        lire_pdf(chemin_pdf)

    except FileNotFoundError:
        # Cette erreur survient si le chemin du fichier est incorrect.
        print(f"Erreur : le fichier '{chemin_pdf}' est introuvable.")
        print("Vérifie que le PDF se trouve bien dans le même dossier "
              "que ce script, ou corrige le chemin dans le code.")