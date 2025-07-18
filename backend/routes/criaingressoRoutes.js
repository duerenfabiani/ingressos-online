// backend/routes/criaingressoRoutes.js

const express = require('express');
const router = express.Router();
const ingressoController = require('../controllers/criaIngressoController');
const db = require('../models/db');

// Rota para criar ingresso
router.post('/', ingressoController.criarIngresso);

// Rota para buscar ingressos por evento_id
router.get('/', async (req, res) => {
  const eventoId = req.query.evento_id;

  if (!eventoId) {
    return res.status(400).json({ error: 'Parâmetro evento_id é obrigatório.' });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM ingressos WHERE evento_id = ? ORDER BY created_at DESC',
      [eventoId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar ingressos:', error);
    res.status(500).json({ error: 'Erro ao buscar ingressos.' });
  }
});

module.exports = router;
