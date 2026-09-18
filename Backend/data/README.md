# data/

Dossier de données locales du Backend, volontairement vide dans le
repository (voir `.gitignore` à la racine).

- `chroma_db/` — index vectoriel ChromaDB, généré localement par
  `python -m rag.indexation`. Ne pas versionner (reconstructible).
- Document de démonstration indexé par le RAG (CV personnel au
  format PDF) — retiré du repository public car il contient des
  informations personnelles. Pour reproduire l'indexation en local,
  place un PDF de ton choix dans ce dossier et adapte le chemin
  `CHEMIN_CV_DEMO` dans `rag/config.py`, ou renomme ton fichier pour
  qu'il corresponde au chemin déjà défini.
