const db = require('../models/db');

exports.criarLote = async (req, res) => {
  const { evento_id, nome, valor, data_inicio, data_fim, quantidade } = req.body;

  try {
    await db.query(
      'INSERT INTO lotes (evento_id, nome, valor, data_inicio, data_fim, quantidade) VALUES (?, ?, ?, ?, ?, ?)',
      [evento_id, nome, valor, data_inicio, data_fim, quantidade]
    );
    res.json({ sucesso: 'Lote criado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar lote.' });
  }
};

exports.listarLotes = async (req, res) => {
  const { eventoId } = req.params;

  try {
    const [lotes] = await db.query('SELECT * FROM lotes WHERE evento_id = ?', [eventoId]);
    res.json(lotes);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar lotes.' });
  }
};
