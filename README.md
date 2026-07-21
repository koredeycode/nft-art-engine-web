# NFT Art Engine Web

A web-based NFT art generation platform, ported from the [HashLips Art Engine](https://github.com/HashLips/hashlips_art_engine) into a modern full-stack monorepo.

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 22, TypeScript strict |
| API | Hono.js |
| Database | SQLite via libsql + Drizzle ORM |
| Auth | Better Auth |
| Queue | BullMQ + Redis |
| Frontend | React 19, react-router v7, Tailwind CSS v4, Vite 6 |
| Monorepo | pnpm workspaces, Turborepo |
| Lint/Format | Biome |
| Tests | Vitest |
| Observability | OpenTelemetry, Prometheus, Grafana |
| Container | Docker, Docker Compose |

## Getting Started

```bash
pnpm install
pnpm dev
```

- Server: http://localhost:3001
- Web: http://localhost:5173

## Project Structure

```
nft-art-engine-web/
├── apps/
│   ├── server/          # Hono.js API server
│   │   ├── src/
│   │   │   ├── db/      # Drizzle schema & client
│   │   │   ├── engine/  # Core generation logic (ported)
│   │   │   ├── lib/     # Auth, logger, observability, WebSocket
│   │   │   └── routes/  # REST API routes
│   │   └── drizzle.config.ts
│   └── web/             # Vite + React 19 frontend
│       └── src/
│           ├── lib/     # API client
│           └── pages/   # Route pages
├── packages/
│   └── shared/          # Zod schemas & constants
├── compose.yaml         # Full Docker stack
└── Dockerfile           # Server container
```

## Scripts

```bash
pnpm dev              # Start all apps in dev mode
pnpm build            # Build all apps
pnpm typecheck        # Type-check all packages
pnpm lint             # Lint all packages
pnpm test             # Run all tests
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get project |
| PATCH | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| GET | `/api/layers/project/:id` | List layers |
| POST | `/api/layers/project/:id` | Add layer |
| GET | `/api/layers/:id/elements` | List elements |
| POST | `/api/generation/start/:id` | Start generation |
| GET | `/api/generation/status/:id` | Job status |
| GET | `/api/exports/:jobId/image/:edition` | Get generated image |
| GET | `/api/exports/:jobId/metadata` | Get collection metadata |

## Docker

```bash
docker compose up -d
```

Starts the server, web app, Redis, OpenTelemetry collector, Prometheus, and Grafana.

## License

MIT
