ARG NODE_VERSION=22.16.0
FROM node:${NODE_VERSION}-alpine AS base
RUN apk update
WORKDIR /app
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
# install pnpm package manager
RUN npm install -g pnpm 
# Make file an executable


# cache dependacies
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm fetch
RUN pnpm install --frozen-lockfile

# Builder
FROM deps AS builder
COPY . .

RUN pnpm run build

# ---- Production Runner ----
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat
# Install pnpm in runner stage
RUN npm install -g pnpm

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 expressjs

USER expressjs

# Copy only necessary files
COPY --from=builder /app/dist ./
COPY --from=builder /app/package.json ./
# COPY --from=builder /app/wait-for-db.sh ./
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 8000

# CMD ["./wait-for-db.sh"]
CMD ["node", "index.js"]


