const express = require('express');
const router = express.Router();
const { getHealth, getRandomExcuse } = require('../controllers/excuse.controller.js');

router.get('/health', getHealth);
router.get('/excuse', getRandomExcuse);

module.exports = router;