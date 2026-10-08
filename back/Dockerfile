# 1. Image de base OS minimaliste et optimisée
FROM node:20-alpine

# 2. Structure de dossiers
WORKDIR /app

# 3. Variables d'environnement (Arguments au build/run)
ENV PORT=3000
ENV NODE_ENV=production

# 4. Installation des dépendances optimisée (mise en cache Docker)
COPY package*.json ./
RUN npm ci --only=production

# 5. Copie des fichiers métier
COPY src/ ./src/

# 6. Manipulation OS & Sécurité : Création utilisateur non-privilégié et droits
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app
USER appuser

# 7. Exposition du port
EXPOSE 3000

# 8. Entrypoint
ENTRYPOINT ["node"]
CMD ["src/server.js"]