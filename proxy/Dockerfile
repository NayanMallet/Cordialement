# Utilisation de l'image officielle Nginx basée sur Alpine Linux (légère et optimisée)
FROM nginx:alpine

# Manipulation OS : Suppression du fichier de configuration Nginx par défaut
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copie de notre fichier de configuration personnalisé pour le Reverse Proxy
COPY default.conf /etc/nginx/conf.d/default.conf

# Déclaration du port d'écoute HTTP exposé par le proxy
EXPOSE 80

# Commande de lancement de Nginx au premier plan pour maintenir le conteneur actif
CMD ["nginx", "-g", "daemon off;"]
