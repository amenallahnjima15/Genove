"""
Package "database" — Accès PostgreSQL (données structurées du site
Genove : formations, projets, etc.).

La logique de connexion et les requêtes vivent dans connection.py.
Ce fichier ré-exporte l'API publique pour que le reste du projet
(agents/database_agent.py, main.py) continue d'utiliser :

    import database
    database.init_db()
    database.lister_formations()
    ...

exactement comme avant la réorganisation (quand tout vivait dans un
seul fichier database.py).
"""

from .connection import (
    DATABASE_URL,
    get_connection,
    init_db,
    lister_formations,
    compter_formations,
    rechercher_formations,
    FORMATIONS_DEMO,
)

__all__ = [
    "DATABASE_URL",
    "get_connection",
    "init_db",
    "lister_formations",
    "compter_formations",
    "rechercher_formations",
    "FORMATIONS_DEMO",
]
