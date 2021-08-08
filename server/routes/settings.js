const express = require('express');
const settingsControllers = require('../controllers/settings');

const router = express.Router();

router.post('/getSettings', settingsControllers.load_settings);
router.post('/saveSettings', settingsControllers.save_settings);

module.exports = router;