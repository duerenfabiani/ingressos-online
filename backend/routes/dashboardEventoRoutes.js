const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboardEventoController');

router.get('/:id/dashboard', controller.getDashboard);

module.exports = router;