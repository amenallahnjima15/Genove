"""
Connexion et accès à PostgreSQL — données STRUCTURÉES du site
Genove (formations, projets, etc.).

À NE PAS confondre avec ChromaDB, qui reste dédié à la recherche
sémantique documentaire (RAG) et n'est pas touché par ce fichier :

    PostgreSQL = données structurées du site (formations, projets,
                 utilisateurs, conversations...)
    ChromaDB   = connaissances documentaires (PDF, texte, chunks,
                 embeddings, recherche sémantique)

Configuration via la variable d'environnement DATABASE_URL, ex :

    postgresql://postgres:123456789@localhost:5432/genove_db

Si DATABASE_URL n'est pas définie, une valeur par défaut adaptée à
un environnement de développement local est utilisée (utilisateur
"postgres", mot de passe "123456789", base "genove_db").

------------------------------------------------------------------
EXTENSIBILITÉ :

Aujourd'hui, une seule table est implémentée : formations. Pour
ajouter une nouvelle table (projects, users, documents,
conversations, messages...), suivre le même schéma :

    1. Ajouter le CREATE TABLE IF NOT EXISTS correspondant dans
       init_db().
    2. Écrire des fonctions de lecture dédiées (lister_x,
       compter_x, rechercher_x), sur le modèle de celles ci-dessous
       pour formations.
    3. Adapter agents/database_agent.py pour qu'il sache distinguer
       quelle table interroger selon la question / l'intent.

Aucune autre partie du projet (ChromaDB, Qwen3, FastAPI, frontend)
n'a besoin d'être modifiée pour ajouter une table.
"""

import os

import psycopg2
import psycopg2.extras


DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://postgres:123456789@localhost:5432/genove_db",
)


def get_connection():
    """
    Ouvre une nouvelle connexion PostgreSQL.
    L'appelant est responsable de la fermer (voir les fonctions
    ci-dessous, qui utilisent toutes try/finally).
    """

    return psycopg2.connect(DATABASE_URL)


# =========================================================
# TABLE : formations
# =========================================================

FORMATIONS_DEMO = [
    (
        "Data Analysis avec Python",
        "Introduction à l'analyse de données : pandas, numpy, visualisation.",
        "6 semaines",
    ),
    (
        "Développement Web Full-Stack",
        "React, Node.js, bases de données relationnelles.",
        "12 semaines",
    ),
    (
        "Intelligence Artificielle & Machine Learning",
        "Fondamentaux du machine learning, réseaux de neurones, projets pratiques.",
        "10 semaines",
    ),
    (
        "Cybersécurité pour Développeurs",
        "Bonnes pratiques de sécurité applicative et gestion des vulnérabilités.",
        "4 semaines",
    ),
]


def init_db() -> None:
    """
    Crée la table `formations` si elle n'existe pas encore, et
    insère des données de démonstration si la table est vide.

    Appelée automatiquement au démarrage de l'API (voir api.py).
    Ne lève pas d'exception vers un appelant qui ne la catch pas
    volontairement — voir la gestion d'erreur dans api.py, qui
    journalise un avertissement plutôt que de faire planter le
    démarrage si PostgreSQL est indisponible.
    """

    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    CREATE TABLE IF NOT EXISTS formations (
                        id SERIAL PRIMARY KEY,
                        title TEXT NOT NULL,
                        description TEXT,
                        duration TEXT
                    );
                    """
                )

                cur.execute("SELECT COUNT(*) FROM formations;")
                (nombre,) = cur.fetchone()

                if nombre == 0:
                    cur.executemany(
                        "INSERT INTO formations (title, description, duration) "
                        "VALUES (%s, %s, %s);",
                        FORMATIONS_DEMO,
                    )
    finally:
        conn.close()


def lister_formations() -> list[dict]:
    """Retourne toutes les formations."""

    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                "SELECT id, title, description, duration FROM formations ORDER BY id;"
            )
            return [dict(ligne) for ligne in cur.fetchall()]
    finally:
        conn.close()


def compter_formations() -> int:
    """Retourne le nombre total de formations."""

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM formations;")
            (nombre,) = cur.fetchone()
            return nombre
    finally:
        conn.close()


def rechercher_formations(terme: str) -> list[dict]:
    """
    Recherche les formations dont le titre ou la description
    contient `terme` (recherche insensible à la casse, via ILIKE).
    """

    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                """
                SELECT id, title, description, duration
                FROM formations
                WHERE title ILIKE %s OR description ILIKE %s
                ORDER BY id;
                """,
                (f"%{terme}%", f"%{terme}%"),
            )
            return [dict(ligne) for ligne in cur.fetchall()]
    finally:
        conn.close()


if __name__ == "__main__":
    # Initialisation manuelle : `python database.py`
    print("=== Initialisation de PostgreSQL (table formations) ===\n")

    try:
        init_db()
        formations = lister_formations()

        print(f"Table 'formations' prête — {len(formations)} formation(s) :\n")

        for f in formations:
            print(f"  - {f['title']} ({f['duration']})")

        print("\n=== Initialisation terminée avec succès ===")

    except psycopg2.OperationalError as erreur:
        print(f"Erreur de connexion à PostgreSQL : {erreur}")
        print("Vérifie que PostgreSQL est lancé et que DATABASE_URL est correcte.")

    except Exception as erreur:
        print(f"Une erreur est survenue : {erreur}")
