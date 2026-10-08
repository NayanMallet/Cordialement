FROM nginx:alpine

# 1. Manipulation OS : Nettoyage de la configuration par défaut
RUN rm -rf /etc/nginx/conf.d/default.conf

# 2. Configuration du Reverse Proxy
COPY default.conf /etc/nginx/conf.d/default.conf

# 3. Exposition du port
EXPOSE 80

# 4. Lancement de Nginx au premier plan
CMD ["nginx", "-g", "daemon off;"]
