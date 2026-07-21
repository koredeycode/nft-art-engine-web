# Progress

## Completed

- [x] Root monorepo config (pnpm workspace, Turborepo, Biome, strict TS)
- [x] `@nft-engine/shared` — Zod schemas, constants
- [x] `@nft-engine/server` scaffold — Hono entrypoint, health check
- [x] Database schema + Drizzle client + Better Auth + Pino logger + OpenTelemetry
- [x] Engine port — DNA, layer loader, renderer, metadata, generator, giffer (20 tests)
- [x] API routes — projects, layers, generation, exports
- [x] WebSocket — job progress broadcasting
- [x] `@nft-engine/web` scaffold — Vite + React 19 + Tailwind v4
- [x] Frontend pages — Dashboard with API client
- [x] Docker — server, web, compose (Redis, OTel, Prometheus, Grafana)
- [x] CI — GitHub Actions workflow

## Remaining

- [ ] Full project detail page (layers, elements, weights UI)
- [ ] Live generation page with WebSocket progress
- [ ] Auth UI (signup/signin pages)
- [ ] Settings page (project config editor)
- [ ] Preview/rarity utilities
- [ ] Metadata update/re-gen tools
- [ ] Advanced generation controls (shuffle, GIF export, text mode)
- [ ] Admin/user management
- [ ] Production Docker build optimization
- [ ] End-to-end tests
