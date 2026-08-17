# syntax=docker/dockerfile:1

FROM node:24-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# ---- dev: hot reload, source comes from the bind mount ----
FROM deps AS dev
EXPOSE 4322
# Clear stale Astro lock from bind mount (PIDs reset across container restarts)
CMD ["sh", "-c", "rm -f .astro/dev.json && npm run dev"]

# ---- build: static output ----
FROM deps AS build
COPY . .
RUN npm run build

# ---- prod: nginx serving dist/ ----
FROM nginx:alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
