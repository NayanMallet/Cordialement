const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Liste d'excuses professionnelles
const excuses = [
  "Ce n'est pas un bug, c'est une fonctionnalité non documentée issue d'un alignement agile imprévu.",
  "Le déploiement a été différé suite à une latence imprévue dans la synchronisation des microservices.",
  "J'étais en train de restructurer le pipeline CI/CD pour optimiser notre vélocité stratégique.",
  "Le commit est bloqué dans une boucle de rebase temporelle en attendant la validation du comité d'architecture.",
  "Une régression asynchrone s'est glissée pendant la phase de refactorisation du backlog prioritaire.",
  "Notre fournisseur cloud a subi une micro-coupure réseau non planifiée lors de l'exécution de la tâche."
];

// Route de vérification de l'état du service (Healthcheck)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Route pour générer une excuse aléatoire
app.get('/api/excuse', (req, res) => {
  const randomIndex = Math.floor(Math.random() * excuses.length);
  const excuse = excuses[randomIndex];
  res.status(200).json({
    id: randomIndex + 1,
    excuse: excuse
  });
});

// Démarrage du serveur
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur Backend démarré et à l'écoute sur le port ${PORT}`);
});

// Gestion propre des signaux d'arrêt (SIGTERM / SIGINT)
const gracefulShutdown = (signal) => {
  console.log(`Signal ${signal} reçu : fermeture gracieuse du serveur...`);
  server.close(() => {
    console.log('Serveur HTTP fermé.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = { app, server, excuses };
