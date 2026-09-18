# Genove — Frontend

Application React du site Genove (catalogue de formations, projets
et assistant chatbot RAG). Construite avec **TanStack Start**
(React + Vite + SSR), **TypeScript** et **Tailwind CSS**.

## Stack technique

- [React 19](https://react.dev/) + [TanStack Start](https://tanstack.com/start) (routing file-based, SSR)
- [Vite](https://vitejs.dev/) — bundler / dev server
- [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (composants Radix UI)
- [Supabase](https://supabase.com/) — authentification (voir `src/integrations/supabase/`)
- [TanStack Query](https://tanstack.com/query) — gestion des requêtes/état serveur

## Prérequis

- [Node.js](https://nodejs.org/) (LTS recommandé) et npm — [installation via nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

## Installation

```bash
cd Frontend
npm install
cp .env.example .env      # variables Supabase (voir ci-dessous)
npm run dev                # http://localhost:3000
```

## Configuration (Supabase)

Le client Supabase (`src/integrations/supabase/client.ts`) attend
les variables suivantes (voir `.env.example`) :

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Si ces variables sont absentes, l'application bascule automatiquement
sur un client Supabase **mocké en mémoire** (`createMockSupabaseClient`)
afin de rester utilisable en développement sans compte Supabase réel.

## Scripts disponibles

| Commande            | Description                                  |
| -------------------- | --------------------------------------------- |
| `npm run dev`         | Lance le serveur de développement (port 3000) |
| `npm run build`       | Build de production                           |
| `npm run build:dev`   | Build en mode développement                   |
| `npm run preview`     | Prévisualise le build de production           |
| `npm run lint`        | Lint (ESLint)                                 |
| `npm run format`      | Formatage (Prettier)                          |

## Structure du projet

```text
Frontend/
│
├── src/
│   ├── routes/           Pages (routing file-based TanStack Start — voir src/routes/README.md)
│   ├── components/       Composants React (genove/, dashboard/, ui/)
│   ├── integrations/     Clients externes (Supabase, Genove)
│   ├── lib/               Contexts, utilitaires (auth, langue, stockage du chat...)
│   ├── router.tsx         Configuration du routeur
│   ├── server.ts / start.ts  Entrées SSR (TanStack Start)
│   └── styles.css         Styles globaux / Tailwind
│
├── public/                Assets statiques
├── package.json
└── vite.config.ts
```

Le routing suit les conventions de TanStack Start (fichiers sous
`src/routes/`) — voir [`src/routes/README.md`](./src/routes/README.md)
pour le détail.

## Communication avec le Backend

Le widget de chat (`src/components/genove/ChatWidget.tsx`) envoie
les questions de l'utilisateur en `POST` vers l'API FastAPI du
Backend (`http://localhost:8000/chat` en développement). Voir
[`../Backend/README.md`](../Backend/README.md) pour lancer l'API.

## Notes

- `AGENTS.md` — consignes de contribution pour ce dépôt (TypeScript
  propre, Tailwind, responsive).
- `metadata.json` — fichier de métadonnées hérité d'un outil de
  prototypage utilisé lors des premières itérations du projet ; il
  n'est référencé par aucun code de l'application (voir le rapport
  de préparation du repository pour plus de détails).
