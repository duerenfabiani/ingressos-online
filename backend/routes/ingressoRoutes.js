const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Rota para criar um ingresso
router.post('/criar', (req, res) => {
    const { evento_id, lote_id, participante_nome, participante_email, valor_unitario } = req.body;
    const query = `INSERT INTO ingressos (evento_id, lote_id, participante_nome, participante_email, valor_unitario, status) VALUES (?, ?, ?, ?, ?, 'pendente')`;
    db.query(query, [evento_id, lote_id, participante_nome, participante_email, valor_unitario], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, participante_nome, participante_email });
    });
});

// Rota para listar ingressos
router.get('/', (req, res) => {
    const query = `SELECT * FROM ingressos`;
    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// Rota para atualizar o status de um ingresso (pagamento confirmado)
router.put('/atualizar-status/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const query = `UPDATE ingressos SET status = ? WHERE id = ?`;
    db.query(query, [status, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Status atualizado', id, status });
    });
});

module.exports = router;
