const db = require('../models/db');

// 🔹 1. GET lotes por evento
exports.getLotesPorEvento = async (req, res) => {
  const evento_id = req.params.evento_id;

  try {
    const [lotes] = await db.query('SELECT * FROM lotes WHERE evento_id = ?', [evento_id]);
    res.json(lotes);
  } catch (error) {
    console.error('Erro ao buscar lotes:', error);
    res.status(500).json({ erro: 'Erro ao buscar lotes' });
  }
};

// 🔹 2. Criar evento
exports.criarEvento = async (req, res) => {
  const { nome, descricao, banner, data_evento } = req.body;
  const usuarioId = req.usuario.id;

  if (!nome || !data_evento) {
    return res.status(400).json({ erro: 'Nome e data do evento são obrigatórios.' });
  }

  try {
    await db.query(
      'INSERT INTO eventos (nome, descricao, banner, data_evento, criado_por) VALUES (?, ?, ?, ?, ?)',
      [nome, descricao, banner, data_evento, usuarioId]
    );
    res.json({ sucesso: 'Evento criado com sucesso!' });
  } catch (err) {
    console.error('Erro ao criar evento:', err);
    res.status(500).json({ erro: 'Erro ao criar evento.' });
  }
};

// 🔹 3. Listar todos os eventos
exports.listarEventos = async (req, res) => {
  try {
    const [eventos] = await db.query('SELECT * FROM eventos');
    res.json(eventos);
  } catch (err) {
    console.error('Erro ao listar eventos:', err);
    res.status(500).json({ erro: 'Erro ao listar eventos.' });
  }
};

// 🔹 4. Buscar evento por ID (NOVO)
exports.getEventoPorId = async (req, res) => {
  const id = req.params.id;

  try {
    const [result] = await db.query(
      `SELECT id, titulo AS nome, descricao, banner_url, data_inicio, data_fim, local 
       FROM eventos 
       WHERE id = ?`,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ erro: 'Evento não encontrado.' });
    }

    const evento = result[0];

    // Montar imagem_url absoluta para frontend
    const host = req.protocol + '://' + req.get('host');
    evento.imagem_url = evento.banner_url
      ? `${host}${evento.banner_url}`
      : null;

    res.json(evento);
  } catch (err) {
    console.error('Erro ao buscar evento por ID:', err);
    res.status(500).json({ erro: 'Erro ao buscar evento.' });
  }
};

