# Genove — Backend

API FastAPI du chatbot RAG multi-agents de Genove.

## Architecture

```text
Backend/
│
├── agents/                # Architecture multi-agents
│   ├── routing_agent.py       Agent de Routage      -> décide "database" / "rag" / "both" / "general"
│   ├── retrieval_agent.py     Agent de Recherche     -> interroge ChromaDB via rag/
│   ├── database_agent.py      Agent Base de Données  -> interroge PostgreSQL via database/
│   ├── synthesis_agent.py     Agent de Synthèse      -> génère la réponse finale (Qwen3 / Ollama)
│   └── orchestrator.py        Assemble les 4 agents (process_question)
│
├── rag/                    # Pipeline RAG (ChromaDB + embeddings + Ollama)
│   ├── config.py               Chemins et constantes centralisés (ChromaDB, Ollama, PDF démo)
│   ├── lire_pdf.py             Extraction de texte depuis un PDF
│   ├── text_chunking.py        Découpage du texte en chunks par section
│   ├── embeddings.py           Génération des embeddings (Ollama / qwen3-embedding)
│   ├── indexation.py           Indexation des chunks dans ChromaDB
│   ├── semantic_search.py      Recherche sémantique (CLI de test)
│   └── rag.py                  Pipeline complet question -> contexte -> réponse
│
├── database/                # Accès PostgreSQL (données structurées)
│   └── connection.py           Connexion + requêtes sur la table `formations`
│
├── routes/                  # Endpoints FastAPI
│   └── chat.py                  GET / , POST /chat
│
├── tests/
│   └── test_agents.py          Tests d'intégration des 4 agents + du workflow complet
│
├── data/                     # Données persistées
│   ├── chroma_db/               Index vectoriel ChromaDB
│   └── Amen_Allah_Njima_CV_FR.pdf   Document de démonstration indexé
│
├── chatbot_cli.py            CLI de test du pipeline RAG en ligne de commande
├── main.py                   Point d'entrée FastAPI (app + CORS + startup)
├── requirements.txt
├── .env.example
└── README.md
```

Aucune logique n'a été réécrite lors de cette réorganisation : les
fichiers ont été déplacés et les imports adaptés à la nouvelle
arborescence (notamment les chemins ChromaDB/PDF, désormais calculés
en absolu via `rag/config.py` plutôt qu'en relatif, pour ne plus
dépendre du dossier depuis lequel le serveur est lancé).

## Prérequis

- Python 3.11+
- [Ollama](https://ollama.com) installé et lancé (`ollama serve`), avec les modèles :
  ```bash
  ollama pull qwen3:8b
  ollama pull qwen3-embedding:4b
  ```
- PostgreSQL accessible (optionnel pour tester uniquement le RAG documentaire ; requis pour les questions de type "database")

## Installation

Pas d'environnement virtuel : on utilise directement le Python installé
sur la machine.

```bash
cd Backend
python --version
pip install -r requirements.txt
cp .env.example .env             # puis adapte DATABASE_URL si besoin
```

Base de données locale attendue (voir `database/connection.py`) :

```text
Database : genove_db
User     : postgres
Password : <à définir localement — voir la note ci-dessous>
```

> ℹ️ Si `DATABASE_URL` n'est pas définie, `database/connection.py`
> retombe sur un mot de passe de développement local codé en dur.
> C'est acceptable pour une machine de dev isolée, mais il est
> recommandé de toujours définir `DATABASE_URL` via `.env` (y
> compris en local) plutôt que de dépendre de cette valeur par
> défaut. Voir la section "Problèmes techniques identifiés" du
> rapport de préparation du repository pour plus de détails.

## Indexer le document de démonstration (ChromaDB)

À faire une fois (ou à chaque fois qu'un nouveau document doit être indexé) :

```bash
cd Backend
python -m rag.indexation
```

## Lancer l'API

```bash
cd Backend
uvicorn main:app --reload
```

- API : http://localhost:8000
- Documentation interactive : http://localhost:8000/docs
- Route principale : `POST /chat` avec `{ "question": "..." }` -> `{ "reponse": "..." }`

## Tester en ligne de commande (sans passer par l'API)

```bash
cd Backend
python chatbot_cli.py
```

## Lancer les tests

```bash
cd Backend
python -m tests.test_agents
```

## Notes

- ChromaDB (`data/chroma_db/`) = recherche sémantique documentaire (PDF, texte).
- PostgreSQL (`DATABASE_URL`) = données structurées du site (formations, projets...).
- Les deux systèmes coexistent et sont interrogés indépendamment selon
  la route choisie par l'Agent de Routage (`database`, `rag`, `both`, `general`).
