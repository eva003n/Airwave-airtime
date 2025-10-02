# Build react app
FROM node:22-alpine AS base
WORKDIR /app
# install pnpm
RUN npm install -g pnpm


FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm fetch
RUN pnpm install --frozen-lockfile

FROM deps AS builder
COPY . .
RUN pnpm run build

FROM nginx:stable-alpine
WORKDIR /app
# Copy only necessary files
COPY --from=builder /app/dist /usr/share/nginx/html
# Prevent $)$ page not foud error when serving single page frontend apps
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000


CMD ["nginx", "-g",  "daemon off;"]


