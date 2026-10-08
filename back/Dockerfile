FROM node:20-alpine

# 1. Sécurité : Création d'un utilisateur non-privilégié
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 2. Structure de dossiers
WORKDIR /app

# 3. Variables d'environnement
ENV PORT=3000
ENV NODE_ENV=production

# 4. Installation des dépendances
COPY package*.json ./
RUN npm ci --only=production

# 5. Copie des fichiers métier
COPY src/ ./src/

# 6. Manipulation OS : Droits d'accès
RUN chown -R appuser:appgroup /app
USER appuser

# 7. Exposition du port
EXPOSE 3000

# 8. Lancement via le serveur
CMD ["node", "src/index.js"]
