# Utiliser une image Node légère
FROM node:18-alpine AS builder

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le projet (pour build)
COPY . .

# Lancer le build de l'application spécifique
RUN npm run build -- --project=apps/totem-api-gateway

# Utiliser une image légère pour l'exécution
FROM node:18-alpine

WORKDIR /usr/src/app

# Copier les fichiers buildés de l'étape précédente
COPY --from=builder /usr/src/app/dist/apps/totem-api-gateway ./dist
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm install --production

# Exposer le port de l'API Gateway
EXPOSE 3000

# Démarrer l'application
CMD ["node", "dist/apps/totem-api-gateway/main.js"]
