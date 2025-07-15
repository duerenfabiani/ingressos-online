const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Rota para buscar eventos
router.get('/', async (req, res) => {
  try {
    let query = 'SELECT * FROM eventos ORDER BY data_inicio DESC';
    let rows;

    if (req.query.date) {
      const selectedDate = req.query.date;
      query = `
        SELECT * FROM eventos
        WHERE DATE(data_fim) >= ?
        ORDER BY data_inicio DESC
      `;
      [rows] = await db.query(query, [selectedDate]);
    } else {
      [rows] = await db.query(query);
    }

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Rota para pegar um evento específico pelo ID
router.get('/:eventoId', async (req, res) => {
  try {
    const eventoId = req.params.eventoId;
    const [rows] = await db.query('SELECT * FROM eventos WHERE id = ?', [eventoId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Rota para pegar os lotes de um evento específico
router.get('/:eventoId/lotes', async (req, res) => {
  try {
    const eventoId = req.params.eventoId;
    const [rows] = await db.query('SELECT * FROM lotes WHERE evento_id = ?', [eventoId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Lotes não encontrados para este evento' });
    }

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
