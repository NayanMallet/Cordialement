# Cordialement - Traducteur Corporate par IA

Architecture micro-services conteneurisée pour le déploiement d'un outil parodique de traduction d'entreprise, orchestrée via Docker Compose.

## 🏗 Structure du Projet

L'infrastructure est segmentée en trois services isolés communiquant sur un réseau privé Docker (`bridge`). L'application permet à un utilisateur de saisir une pensée brute ou sous le coup de l'émotion, et de la traduire via IA en un message professionnel, politiquement correct et subtilement passif-agressif.

### 1. Front-end (Vue.js + Nginx Alpine) :

Application cliente générée via Vite (Vue 3, TypeScript, Tailwind CSS). L'image finale ne contient que les fichiers statiques compilés, servis par un serveur web léger. L'interface capture le texte brut saisi par l'utilisateur et affiche le résultat corporate.

* **Choix de l'OS (Alpine)** : Nous utilisons `nginx:alpine` dans l'étape finale du multi-stage build. Alpine Linux réduit la taille de l'image à environ 20-30 Mo, accélérant drastiquement le déploiement par rapport à une image Debian classique.
* **Multi-stage build** : L'image utilise d'abord un environnement Node pour compiler le TypeScript et le Vue.js, puis transfère uniquement le dossier `dist/` vers l'image Nginx. Le code source et les lourds répertoires `node_modules` ne se retrouvent pas en production.
* **Manipulation OS (`rm -rf /usr/share/nginx/html/*`)** : Suppression de la page d'accueil par défaut de Nginx pour éviter les conflits et s'assurer que seuls nos fichiers métier sont servis.

### 2. Back-end API (Node.js Alpine) :

Point d'entrée pour la logique métier. Utilise Express.js pour réceptionner le texte brut, lui injecter un "System Prompt" strict (ex: "Tu es un expert en ressources humaines, traduis ce texte de manière diplomatique..."), et interroger une API externe d'Intelligence Artificielle (ex: Groq/OpenAI) de manière sécurisée.

* **Masquage de la clé API** : Le conteneur back-end est indispensable ici pour sécuriser l'appel à l'IA. Si l'appel était fait depuis le Front, la clé API serait exposée côté client.
* **Choix de l'OS (Node Alpine)** : Image officielle allégée. Node.js est un choix pertinent ici pour gérer efficacement les requêtes HTTP asynchrones vers l'API externe sans bloquer le thread principal.
* **adduser -S appuser** : Par défaut, Docker exécute les processus en tant que `root`. Nous créons un utilisateur système non privilégié (`appuser`) et limitons ses droits. En cas de faille, l'attaquant ne sera pas super-administrateur du conteneur.
* **ENV PORT=3000** : Paramétrage dynamique. Au lieu de coder le port d'écoute "en dur" dans le fichier JavaScript, nous utilisons une variable d'environnement qui peut être écrasée au "run".

### 3. Web Proxy (Nginx Alpine) :

Point d'entrée unique de notre cloud. Il intercepte le trafic et dispatche les requêtes selon les routes.

* **Reverse Proxy** : Protège l'infrastructure interne. Seul ce conteneur expose un port (8080) vers la machine hôte. Le front et le back ne communiquent qu'en interne, isolant l'API d'un accès direct non désiré.
* **Résolution DNS Docker** : La configuration Nginx utilise les noms de services (`http://backend:3000` et `http://frontend:80`) pour router le trafic. L'adresse IP des conteneurs est gérée automatiquement par le daemon Docker.

## 🛠 Spécificités Techniques & Optimisation

* **Images Slim & Ressources** : L'utilisation d'images minimalistes et la limitation des ressources restent une excellente pratique de l'industrie pour densifier les serveurs cloud, réduire la surface d'attaque et accélérer l'intégration continue.
* **0 Image Hub Pure** : Conformément aux exigences du projet, aucune image du Docker Hub n'est utilisée telle quelle[cite: 1]. Chacune dispose de son propre `Dockerfile` qui altère le comportement de base (création d'utilisateurs, modification de configurations OS, compilation de code)[cite: 2].

## ⚙️ Orchestration et Arguments

* **Arguments au Run (Variables d'environnement)**[cite: 2]:
    * `PORT` : Injecté dans le conteneur backend via le Compose pour spécifier son port d'écoute interne.
    * `AI_API_KEY` : Clé d'authentification pour le service d'IA. Elle est passée au *runtime* via le `docker-compose.yml`, évitant ainsi d'inscrire des secrets en dur dans le code source ou l'image Docker.
    * `NODE_ENV=production` : Indique au moteur V8 de Node d'optimiser le cache.

* **Gestion du SIGTERM (Arrêt propre)**[cite: 2]:
    * L'instruction `init: true` est ajoutée à tous les services dans le `docker-compose.yml`. Cela enveloppe l'exécution (PID 1) avec `tini`, un processus d'initialisation léger.
    * *Pourquoi ?* Node.js gère mal le PID 1 sous Docker et peut ignorer le signal `SIGTERM` envoyé par `docker stop`. L'utilisation de `init` garantit que le signal est intercepté et que le serveur Express ou Nginx se coupe proprement (terminant proprement une traduction en cours avant de se fermer), évitant d'attendre le timeout forcé (`SIGKILL`).

* **Limitation des ressources (Deploy/Limits)**[cite: 2]:
    * Des quotas stricts ont été mis en place. Le Backend est limité à `0.5 CPU` et `128M` de RAM, tandis que le Proxy et le Frontend utilisent seulement `0.2 CPU` et `64M` de RAM. Cela garantit un comportement prédictible de l'orchestrateur.

* **Ordre de démarrage (Depends_on & Healthcheck)**[cite: 2]:
    * Le Reverse Proxy refuse de s'allumer tant que le Backend ne répond pas "200 OK" sur sa route `/api/health`. Cela évite qu'un utilisateur reçoive une erreur "502 Bad Gateway" si Nginx démarre plus vite que l'API.

## 🚀 Déploiement et Test

1.  **Lancement global (Build & Run en tâche de fond)** :
    ```bash
    # Nécessite de configurer la variable AI_API_KEY dans l'environnement de l'hôte
    docker-compose up --build -d
    ```

2.  **Test de communication** :
    ```bash
    curl -X POST http://localhost:8080/api/translate \
         -H "Content-Type: application/json" \
         -d '{"text":"Tu me fais chier avec tes questions"}'
    ```