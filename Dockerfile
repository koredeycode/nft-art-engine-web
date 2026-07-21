FROM node:22-alpine AS deps

RUN corepack enable && corepack prepare pnpm@10.29.2 --activate
WORKDIR /app

RUN apk add --no-cache python3 make g++ libc6-compat \
  && apk add --no-cache --virtual .build-deps cairo-dev pango-dev

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/server/package.json ./apps/server/

RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache cairo pango

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/pnpm-lock.yaml ./
COPY . .

EXPOSE 3001

ENV NODE_ENV=production
CMD ["pnpm", "--filter", "@nft-engine/server", "dev"]
