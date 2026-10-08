const express = require('express');
const router = express.Router();
const { getHealth, postTranslate } = require('../controllers/translate.controller.js');

router.get('/health', getHealth);
router.post('/translate', postTranslate);

module.exports = router;
