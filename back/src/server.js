const app = require('./app');

let port = process.env.PORT;
if (!port) {
  port = 3000;
}

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Serveur Backend à l'écoute sur le port ${port}`);
});

const gracefulShutdown = () => {
  console.log('Fermeture gracieuse du serveur...');
  server.close(() => process.exit(0));
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = { app, server };
