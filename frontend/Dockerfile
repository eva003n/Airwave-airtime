# Build react app
FROM node:22-alpine AS builder
WORKDIR /app


# install pnpm
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# COPY --from=builder /app .
EXPOSE 3000
CMD ["pnpm", "run",  "dev"]


