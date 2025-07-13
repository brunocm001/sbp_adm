# Utiliser Node.js 18 Alpine comme image de base
FROM node:18-alpine AS base

# Installer les dépendances nécessaires
RUN apk add --no-cache libc6-compat

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration des dépendances
COPY package*.json ./
COPY astro.config.mjs ./
COPY tailwind.config.mjs ./
COPY tsconfig.json ./

# Installer les dépendances
RUN npm install --only=production

# Copier le code source
COPY . .

# Build de l'application
RUN npm run build

# Image de production avec serveur léger
FROM node:18-alpine AS production

# Installer les dépendances nécessaires
RUN apk add --no-cache libc6-compat

# Créer un utilisateur non-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 astro

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY --from=base /app/package*.json ./
COPY --from=base /app/astro.config.mjs ./

# Installer seulement les dépendances de production
RUN npm install --only=production && npm cache clean --force

# Copier les fichiers buildés
COPY --from=base /app/dist ./dist
COPY --from=base /app/public ./public

# Changer les permissions
RUN chown -R astro:nodejs /app

# Passer à l'utilisateur non-root
USER astro

# Exposer le port
EXPOSE 3000

# Variables d'environnement par défaut
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# Commande de démarrage
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"] 