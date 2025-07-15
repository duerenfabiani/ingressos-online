const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Rota para criar um lote
router.post('/criar', async (req, res) => {
  try {
    const { evento_id, nome, valor, quantidade_total, data_inicio, data_fim } = req.body;

    const query = `
      INSERT INTO lotes (evento_id, nome, valor, quantidade_total, quantidade_vendida, data_inicio, data_fim)
      VALUES (?, ?, ?, ?, 0, ?, ?)
    `;

    const [result] = await db.query(query, [
      evento_id, nome, valor, quantidade_total, data_inicio, data_fim
    ]);

    res.status(201).json({ id: result.insertId, nome, valor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Rota para listar lotes de um evento
router.get('/:evento_id', async (req, res) => {
  try {
    const { evento_id } = req.params;
    console.log(`Procurando lotes para o evento_id: ${evento_id}`);

    const [rows] = await db.query('SELECT * FROM lotes WHERE evento_id = ?', [evento_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Nenhum lote encontrado para este evento.' });
    }

    console.log('Lotes encontrados:', rows);
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar lotes:', err);
    res.status(500).json({ error: err.message });
  }
});

// Rota para atualizar quantidade vendida
router.put('/atualizar-quantidade/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantidade_vendida } = req.body;

    const query = 'UPDATE lotes SET quantidade_vendida = ? WHERE id = ?';
    await db.query(query, [quantidade_vendida, id]);

    res.json({ message: 'Quantidade vendida atualizada', id, quantidade_vendida });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
