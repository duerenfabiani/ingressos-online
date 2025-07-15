// backend/routes/organizadoresRoutes.js
const express = require('express');
const router = express.Router();
const organizadorController = require('../controllers/organizadorController');

// Cadastro de novo organizador
router.post('/', organizadorController.createOrganizador);

// Atualizar perfil
router.put('/perfil', organizadorController.atualizarPerfil);

// Recuperar conta
router.post('/recuperar', organizadorController.recuperarConta);

// Redefinir senha
router.post('/redefinir-senha', organizadorController.redefinirSenha);

module.exports = router;
