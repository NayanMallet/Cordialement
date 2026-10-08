# ==========================================
# ÉTAPE 1 : Compilation du projet frontend (Build stage)
# ==========================================
# image légère Node 20 Alpine pour compiler les assets Vue 3 / TypeScript
FROM node:20-alpine AS build-stage

# 1. Structure de dossiers et Dépendances
WORKDIR /app

# copie package.json et package-lock.json opti la mise en cache
COPY package*.json ./
RUN npm install

# 2. Copie des sources et compilation
COPY . .
RUN npm run build

# ==========================================
# ÉTAPE 2 : Serveur Web Nginx de production (Production stage)
# ==========================================
# image Nginx Alpine (20-30 Mo) pour servir les fichiers statiques de manière ultra-rapide
FROM nginx:alpine AS production-stage

# 4. Manipulation OS : Nettoyage de Nginx (supp fichiers HTML par défaut et configurations de bienvenue)
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# 5. Copie des assets compilés et de la configuration
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 6. Exposition du port
EXPOSE 80

# 7. Lancement
CMD ["nginx", "-g", "daemon off;"]
