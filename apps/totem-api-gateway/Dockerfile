# Utiliser une image Node légère
FROM node:18-alpine AS builder

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install --ignore-scripts

# Copier tout le projet
COPY src .src/
COPY tsconfig.app.json ./

# Lancer le build de l'application
RUN npm run build

# Utiliser une image légère pour l'exécution
FROM node:18-alpine

WORKDIR /usr/src/app

# Copier les fichiers buildés de l'étape précédente
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm install --production --ignore-scripts

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["node", "dist/apps/totem-api-gateway/main.js"]
