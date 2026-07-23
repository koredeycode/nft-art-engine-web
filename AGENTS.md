# Agent Instructions

## Build & Verify

After any change, always run in order:

```bash
pnpm install
pnpm --filter @mintrix/shared typecheck
pnpm --filter @mintrix/server typecheck
pnpm --filter @mintrix/web typecheck
pnpm --filter @mintrix/server test
pnpm --filter @mintrix/web build
```

## Git Convention

- Branch: `develop` for active work, `main` for releases
- Commit style: Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)
- Commit incrementally per logical change
- Always include verification results in commit message
- Never commit secrets

## Project Structure

```
mintrix/
├── apps/
│   ├── server/       # Hono.js API server
│   └── web/          # Vite + React 19 frontend
├── packages/
│   └── shared/       # Zod schemas & constants
├── Dockerfile        # Server container
├── Dockerfile.web    # Web container
└── compose.yaml      # Full stack with Redis, OTel, Prometheus, Grafana
```

## Key Dependencies

- **Runtime**: Hono.js, Drizzle ORM (SQLite via @libsql/client), Better Auth, BullMQ, canvas
- **Tooling**: pnpm 10, Turborepo, Biome, Vitest, TypeScript strict
- **Frontend**: React 19, react-router v7, Tailwind CSS v4, Vite 6
- **Observability**: OpenTelemetry SDK, Prometheus, Grafana

## Engine Porting Notes

The original HashLips engine logic is in `apps/server/src/engine/`:
- `dna.ts` — weighted random selection, uniqueness check
- `layer-loader.ts` — filesystem layer/element loading
- `renderer.ts` — canvas compositing with blend modes
- `metadata.ts` — ETH/Solana metadata generation
- `generator.ts` — main generation loop with progress callbacks
- `giffer.ts` — GIF encoder wrapper
