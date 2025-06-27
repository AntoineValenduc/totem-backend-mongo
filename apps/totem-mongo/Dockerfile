# Étape builder
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copier package.json et package-lock.json d'abord (cache docker)
COPY package*.json ./

# Installer les dépendances (dev + prod)
RUN npm ci --ignore-scripts

# Copier le code source (src + tsconfig)
COPY src ./src/
COPY tsconfig.app.json ./

# Builder l’application
RUN npm run build

# Étape finale (runtime)
FROM node:18-alpine

# Créer un groupe et utilisateur non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /usr/src/app

# Copier les fichiers buildés depuis builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

# Installer uniquement les dépendances de production en une seule commande RUN
RUN npm ci --production --ignore-scripts \
  && chown -R appuser:appgroup /usr/src/app

# Passer à l’utilisateur non-root
USER appuser

EXPOSE 3000

CMD ["node", "dist/apps/totem-api-gateway/main.js"]
