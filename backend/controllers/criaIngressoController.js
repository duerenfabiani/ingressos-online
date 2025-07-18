const db = require('../models/db');

exports.criarIngresso = async (req, res) => {
  try {
    const {
      titulo,
      preco,
      quantidade,
      ocultar,
      sem_taxa,
      descricao,
      inicio_vendas,
      fim_vendas,
      limite_checkin,
      min_por_pedido,
      max_por_pedido,
      max_por_cpf,
      proximo_lote,
      evento_id
    } = req.body;

    if (!titulo || !preco || !quantidade || !evento_id) {
      return res.status(400).json({ error: 'Campos obrigatórios não preenchidos.' });
    }

    await db.query(
      `INSERT INTO ingressos (
        titulo, preco, quantidade, ocultar, sem_taxa, descricao,
        inicio_vendas, fim_vendas, limite_checkin,
        min_por_pedido, max_por_pedido, max_por_cpf, proximo_lote, evento_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        titulo, preco, quantidade, ocultar, sem_taxa, descricao,
        inicio_vendas, fim_vendas, limite_checkin,
        min_por_pedido, max_por_pedido, max_por_cpf, proximo_lote, evento_id
      ]
    );

    res.status(201).json({ message: 'Ingresso criado com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar ingresso:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.listarIngressosPorEvento = async (req, res) => {
  try {
    const { evento_id } = req.query;

    if (!evento_id) {
      return res.status(400).json({ error: 'ID do evento é obrigatório.' });
    }

    const [rows] = await db.query('SELECT * FROM ingressos WHERE evento_id = ?', [evento_id]);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao listar ingressos:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
