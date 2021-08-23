const express = require('express');
const queryControllers = require('../controllers/query');

const router = express.Router();

router.post('/identify', queryControllers.identify);

module.exports = router;