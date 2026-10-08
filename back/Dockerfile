# Étape unique : Image officielle Node.js 20 basée sur Alpine Linux (légère et sécurisée)
FROM node:20-alpine

# Manipulation OS : Création d'un groupe et d'un utilisateur non-root 'appuser' pour ne pas exécuter l'application en root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Définition du répertoire de travail dans le conteneur
WORKDIR /app

# Variable d'environnement pour configurer le port d'écoute avec une valeur par défaut à 3000
ENV PORT=3000

# Variable d'environnement indiquant l'environnement de production (optimisation Express/V8)
ENV NODE_ENV=production

# Copie des fichiers package.json et package-lock.json pour tirer parti du cache Docker lors de l'installation
COPY package*.json ./

# Installation propre des dépendances de production uniquement
RUN npm ci --only=production

# Copie des sources de l'application dans le conteneur
COPY src/ ./src/

# Manipulation OS : Attribution de la propriété des fichiers à l'utilisateur non privilégié 'appuser'
RUN chown -R appuser:appgroup /app

# Bascule vers l'utilisateur non-root pour l'exécution du processus
USER appuser

# Déclaration du port d'écoute exposé par le conteneur
EXPOSE 3000

# Commande d'exécution du serveur Node.js lors du lancement du conteneur
CMD ["node", "src/index.js"]
