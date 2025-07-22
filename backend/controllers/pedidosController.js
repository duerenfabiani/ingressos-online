const db = require('../models/db');

exports.listarPedidos = async (req, res) => {
  try {
    const organizadorId = req.query.organizador_id;

    if (!organizadorId) {
      return res.status(400).json({ erro: 'organizador_id é obrigatório na query' });
    }

    // Buscar pedidos apenas dos eventos criados por este organizador
    const [pedidosRaw] = await db.query(`
      SELECT 
        p.*, 
        c.cpf, 
        c.celular 
      FROM pedidos p
      LEFT JOIN clientes c ON c.email = p.comprador_email
      JOIN eventos e ON e.id = p.evento_id
      WHERE e.criado_por = ?
      ORDER BY p.data_pedido DESC
    `, [organizadorId]);

    const pedidosCompletos = [];

    for (const pedido of pedidosRaw) {
      // Itens do pedido
      const [itens] = await db.query(`
        SELECT ip.*, i.titulo 
        FROM itens_pedido ip
        JOIN ingressos i ON i.id = ip.ingresso_id
        WHERE ip.pedido_id = ?
      `, [pedido.id]);

      // Participantes vinculados aos ingressos gerados
      const [participantes] = await db.query(`
        SELECT 
          ig.id, 
          ig.cliente_email AS email, 
          ig.usado AS checkin, 
          i.titulo AS ingresso,
          c.nome AS nome
        FROM ingressos_gerados ig
        JOIN ingressos i ON i.id = ig.ingresso_id
        LEFT JOIN clientes c ON c.email = ig.cliente_email
        WHERE ig.pedido_id = ?
      `, [pedido.id]);

      pedidosCompletos.push({
        ...pedido,
        valor_total: Number(pedido.valor_total),
        itens,
        participantes
        });
    }

    res.json(pedidosCompletos);
  } catch (err) {
    console.error('Erro ao listar pedidos:', err);
    res.status(500).json({ erro: 'Erro ao buscar pedidos' });
  }
};
