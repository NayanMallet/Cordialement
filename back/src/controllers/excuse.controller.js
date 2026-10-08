const excuses = require('../data/excuses.json');

const getHealth = (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
};

const getRandomExcuse = (req, res) => {
    const randomIndex = Math.floor(Math.random() * excuses.length);
    res.status(200).json({ id: randomIndex + 1, excuse: excuses[randomIndex] });
};

module.exports = { getHealth, getRandomExcuse };