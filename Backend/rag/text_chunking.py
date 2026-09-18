"""
Objectif : découper le texte du PDF
en plusieurs morceaux appelés "chunks".

Pourquoi le chunking ?

Un document entier peut être trop grand
pour être envoyé directement à un modèle.

On découpe donc le document en petits morceaux
afin de faciliter :

    - les embeddings
    - la recherche vectorielle
    - le RAG

------------------------------------------------------------------
CORRECTIF : chunking par SECTION au lieu d'un découpage
brut par nombre de caractères.

Problème observé avec le découpage à taille fixe (500 caractères) :
un CV contient des sections très différentes (profil, compétences,
expérience, projets, langues...). Découper à 500 caractères mélange
souvent des infos de sections différentes dans un même chunk, ou
coupe une info courte (ex: "Anglais B2") en plein milieu.

Résultat : l'embedding du chunk ne représente plus bien un seul
sujet précis, donc la recherche sémantique le retrouve mal pour
des questions ciblées ("quel est mon nom ?", "quel est mon niveau
d'anglais ?").

En découpant par section, chaque chunk reste focalisé sur un seul
sujet (les langues ensemble, les certifications ensemble, etc.),
ce qui rend l'embedding beaucoup plus discriminant.

Si une section est très longue (ex: une longue expérience
professionnelle), on la sous-découpe quand même avec la méthode
par taille fixe + overlap, pour ne pas envoyer un chunk énorme.
"""

import re

from .lire_pdf import lire_pdf_en_texte


# Titres de section reconnus dans le CV.
# Si le format du CV change, il faut mettre cette liste à jour.

TITRES_SECTIONS = [
    "Profile",
    "Profil",
    "COMPÉTENCES CLÉS",
    "Compétences",
    "Expérience Professionnelle",
    "Projets",
    "Formation Académique",
    "Certifications",
    "Langues",
]


def decouper_en_chunks(
    texte: str,
    taille_chunk: int = 500,
    overlap: int = 50
) -> list[str]:
    """
    Découpe un texte en chunks de taille fixe.

    Conservée telle quelle : utilisée en interne pour
    sous-découper les sections trop longues.

    taille_chunk :
        nombre de caractères maximum par chunk.

    overlap :
        nombre de caractères répétés entre
        deux chunks consécutifs.
    """

    if overlap >= taille_chunk:

        raise ValueError(
            "L'overlap doit être inférieur "
            "à la taille du chunk."
        )

    chunks = []

    position = 0

    longueur_texte = len(
        texte
    )

    while position < longueur_texte:

        fin = min(
            position + taille_chunk,
            longueur_texte
        )

        chunk = texte[
            position:fin
        ]

        chunk = chunk.strip()

        if chunk:

            chunks.append(
                chunk
            )

        position += (
            taille_chunk - overlap
        )

    return chunks


def decouper_par_sections(
    texte: str,
    taille_max_section: int = 700,
    overlap: int = 50
) -> list[str]:
    """
    Découpe le texte en chunks par section logique
    (Profil, Compétences, Projets, Langues, etc.)
    au lieu d'une taille fixe en caractères.

    Chaque chunk garde le titre de sa section pour que
    l'embedding capte bien le contexte du chunk.

    Si une section dépasse taille_max_section caractères,
    elle est sous-découpée avec decouper_en_chunks pour
    éviter des chunks trop gros.
    """

    pattern = "(" + "|".join(
        re.escape(titre) for titre in TITRES_SECTIONS
    ) + ")"

    morceaux = re.split(
        pattern,
        texte
    )

    chunks = []

    section_courante = ""

    for morceau in morceaux:

        morceau = morceau.strip()

        if not morceau:
            continue

        if morceau in TITRES_SECTIONS:

            section_courante = morceau

            continue

        # On préfixe le contenu par le titre de section
        # pour renforcer le contexte sémantique du chunk.

        contenu = (
            f"{section_courante} :\n{morceau}"
            if section_courante
            else morceau
        )

        if len(contenu) <= taille_max_section:

            chunks.append(
                contenu
            )

        else:

            # Section trop longue : on la sous-découpe,
            # en gardant le titre de section sur chaque sous-chunk.

            sous_chunks = decouper_en_chunks(
                morceau,
                taille_chunk=taille_max_section,
                overlap=overlap
            )

            for sous_chunk in sous_chunks:

                chunks.append(
                    f"{section_courante} :\n{sous_chunk}"
                    if section_courante
                    else sous_chunk
                )

    return chunks


def afficher_chunks(
    chunks: list[str]
) -> None:
    """
    Affiche tous les chunks dans le terminal.
    """

    print(
        f"Nombre total de chunks générés : "
        f"{len(chunks)}\n"
    )

    for numero, chunk in enumerate(
        chunks,
        start=1
    ):

        print(
            f"----- Chunk {numero}/"
            f"{len(chunks)} "
            f"({len(chunk)} caractères) -----"
        )

        print(
            chunk
        )

        print()


# Test direct du fichier.

if __name__ == "__main__":

    from config import CHEMIN_CV_DEMO

    chemin_pdf = CHEMIN_CV_DEMO

    try:

        texte_complet = lire_pdf_en_texte(
            chemin_pdf
        )

        print(
            f"Texte extrait : "
            f"{len(texte_complet)} caractères.\n"
        )

        mes_chunks = decouper_par_sections(
            texte_complet
        )

        afficher_chunks(
            mes_chunks
        )

    except FileNotFoundError:

        print(
            f"Erreur : le fichier "
            f"'{chemin_pdf}' est introuvable."
        )
