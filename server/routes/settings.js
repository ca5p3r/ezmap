const express = require('express');
const settingsControllers = require('../controllers/settings');

const router = express.Router();

router.post('/getSettings', settingsControllers.load_settings);

module.exports = router;