# Image Node
FROM node:18-alpine AS builder

# Répertoire de travail
WORKDIR /usr/src/app

# Package.json
COPY package*.json ./

# Installer les dépendances
RUN npm install --ignore-scripts

# Copier tout le projet
COPY src .src/
COPY tsconfig.app.json ./

# Build de l'appli
RUN npm run build

# Image Node légère pour l'exécution
FROM node:18-alpine

# Répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers buildés de l'étape précédente
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm install --production --ignore-scripts

# Exposer le port
EXPOSE 3002

# Démarrer l'appli
CMD ["node", "dist/apps/totem-api-gateway/main.js"]
