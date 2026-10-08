const app = require('./app');

// Remplacement du || 3000 par ton if comme demandé
let port = process.env.PORT;
if (!port) {
  port = 3000;
}

// Démarrage du serveur
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Serveur Backend à l'écoute sur le port ${port}`);
});

// Gestion propre des signaux d'arrêt (SIGTERM / SIGINT)
const gracefulShutdown = () => {
  console.log('Fermeture gracieuse du serveur...');
  server.close(() => process.exit(0));
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
