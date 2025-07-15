const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Dados do organizador para validação do primeiro login
router.get('/organizador/:id', dashboardController.getOrganizadorById);

// Dashboard geral
router.get('/:id', dashboardController.getDashboardData);

module.exports = router;
