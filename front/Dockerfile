# ==========================================
# ÉTAPE 1 : Compilation du projet frontend (Build stage)
# ==========================================
# Utilisation de l'image légère Node 20 Alpine pour compiler les assets Vue 3 / TypeScript
FROM node:20-alpine AS build-stage

# Définition du répertoire de travail temporaire de compilation
WORKDIR /app

# Copie des fichiers package.json et package-lock.json pour optimiser la mise en cache des layers Docker
COPY package*.json ./

# Installation complète des dépendances nécessaires au build (incluant TypeScript, Vite, Tailwind CSS)
RUN npm install

# Copie de l'intégralité du code source du frontend
COPY . .

# Exécution du script de build Vite/Vue (génération des fichiers statiques dans le dossier /dist)
RUN npm run build

# ==========================================
# ÉTAPE 2 : Serveur Web Nginx de production (Production stage)
# ==========================================
# Utilisation de l'image Nginx Alpine (environ 20-30 Mo) pour servir les fichiers statiques de manière ultra-rapide
FROM nginx:alpine AS production-stage

# Manipulation OS : Suppression complète des fichiers HTML et configurations de bienvenue par défaut de Nginx
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Copie des fichiers statiques compilés depuis l'étape de build vers le dossier webroot de Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copie de notre configuration Nginx optimisée pour le routage SPA (Single Page Application)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Déclaration du port d'écoute HTTP exposé par le conteneur Nginx
EXPOSE 80

# Commande de démarrage de Nginx au premier plan (daemon off) pour que le conteneur Docker reste actif
CMD ["nginx", "-g", "daemon off;"]
