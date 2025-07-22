const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Buscar participantes com status "pago"
router.get('/:eventoId', async (req, res) => {
  const eventoId = req.params.eventoId;

  try {
    const [rows] = await db.query(`
      SELECT 
        pedidos.id AS id,
        pedidos.comprador_nome AS nome,
        pedidos.comprador_email AS email,
        pedidos.payment_id AS referencia,
        pedidos.status_pagamento,
        pedidos.data_pagamento
      FROM pedidos
      WHERE pedidos.evento_id = ? AND pedidos.status_pagamento = 'pago'
    `, [eventoId]);

    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar participantes:', error);
    res.status(500).json({ erro: 'Erro ao buscar participantes' });
  }
});

module.exports = router;
