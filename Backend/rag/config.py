"""
Configuration centralisée du module RAG.

Objectif : définir une seule fois les chemins et constantes partagés
par rag.py, indexation.py et semantic_search.py (au lieu de les
dupliquer dans chaque fichier), et surtout rendre ces chemins
INDÉPENDANTS du répertoire courant (cwd) depuis lequel le serveur ou
un script est lancé.

Avant la réorganisation, ces fichiers utilisaient des chemins
relatifs comme "./chroma_db", qui ne fonctionnent que si le process
est lancé exactement depuis le dossier contenant le script. En les
calculant à partir de l'emplacement réel de ce fichier
(Path(__file__)), ils fonctionnent de la même façon quel que soit
l'endroit d'où `uvicorn main:app` ou un script est exécuté.
"""

from pathlib import Path

# Backend/rag/config.py -> parent = Backend/rag -> parent.parent = Backend/
BACKEND_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BACKEND_DIR / "data"

# Dossier de persistance ChromaDB (équivalent à l'ancien "./chroma_db",
# mais résolu en chemin absolu basé sur Backend/data/chroma_db).
DOSSIER_CHROMA = str(DATA_DIR / "chroma_db")

NOM_COLLECTION = "genove_documents"

# PDF de démonstration utilisé par les scripts d'indexation/test.
CHEMIN_CV_DEMO = str(DATA_DIR / "Amen_Allah_Njima_CV_FR.pdf")

URL_OLLAMA = "http://localhost:11434/api/generate"

MODELE_LLM = "qwen3:8b"
