# Genove

Plateforme Genove : catalogue de formations, projets et assistant
chatbot RAG multi-agents.

```text
Genove/
│
├── Backend/     API FastAPI, agents (routage/recherche/synthèse), RAG (ChromaDB + Ollama/Qwen), PostgreSQL
│
└── Frontend/    Application React (TanStack Start, Vite, Tailwind CSS)
```

## Backend

Voir [`Backend/README.md`](./Backend/README.md) pour l'installation,
la configuration et le lancement de l'API (`http://localhost:8000`).

Résumé rapide :

```bash
cd Backend
pip install -r requirements.txt
cp .env.example .env
ollama serve                    # dans un autre terminal
python -m rag.indexation        # une fois, pour peupler ChromaDB
uvicorn main:app --reload
```

## Frontend

Voir [`Frontend/README.md`](./Frontend/README.md) pour le détail.

Résumé rapide :

```bash
cd Frontend
npm install
cp .env.example .env            # variables Supabase
npm run dev                     # http://localhost:3000
```

## Fonctionnement d'ensemble

Le Frontend (React) envoie les messages du widget de chat en
`POST http://localhost:8000/chat`. Le Backend route chaque question
vers PostgreSQL (données structurées : formations, projets),
ChromaDB (recherche sémantique documentaire), les deux, ou une
réponse directe, avant de faire générer la réponse finale par Qwen3
via Ollama. Les deux applications sont lancées indépendamment en
développement (Backend sur le port 8000, Frontend sur le port 3000).
