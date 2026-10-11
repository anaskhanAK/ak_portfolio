# syntax=docker/dockerfile:1

# ---- Build: type-check and bundle the static site ----
# Debian (glibc) base: the lockfile ships glibc builds of rolldown, tailwind and sharp for x64 and arm64.
FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
# Optional: absolute URLs for social previews, e.g. --build-arg SITE_URL=https://example.com
ARG SITE_URL=""
RUN SITE_URL="$SITE_URL" npm run build

# ---- Serve: static files from nginx, running as a non-root user on port 8080 ----
FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s CMD wget -qO /dev/null http://127.0.0.1:8080/ || exit 1
