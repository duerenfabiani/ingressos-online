const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.post('/login/google', clienteController.loginComGoogle);
router.post('/login/apple', clienteController.loginComApple);

module.exports = router;
