const corporatePhrases = require('../data/corporate.json');

const getHealth = (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
};

const postTranslate = (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: "Le champ 'text' est requis." });
    }
    const randomIndex = Math.floor(Math.random() * corporatePhrases.length);
    res.status(200).json({ original: text, translated: corporatePhrases[randomIndex] });
};

module.exports = { getHealth, postTranslate };
