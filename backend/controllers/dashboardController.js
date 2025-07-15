//dasboardController.js
const db = require('../models/db');

exports.getDashboardData = async (req, res) => {
  const organizadorId = req.params.id;

  try {
    // Nome da produtora
    const [organizadorRows] = await db.query(
      'SELECT nome_produtora FROM organizadores WHERE id = ?',
      [organizadorId]
    );

    if (!organizadorRows.length) {
      return res.status(404).json({ error: 'Organizador não encontrado' });
    }

    const nome_produtora = organizadorRows[0].nome_produtora;

    // Contagem de eventos
    const [eventosRows] = await db.query(
      'SELECT COUNT(*) AS total_eventos FROM eventos WHERE criado_por = ?',
      [organizadorId]
    );

    // Contagem de ingressos vendidos
    const [ingressosRows] = await db.query(
        `SELECT COUNT(*) AS total_ingressos 
        FROM ingressos i
        JOIN lotes l ON i.lote_id = l.id
        WHERE l.evento_id IN (SELECT id FROM eventos WHERE criado_por = ?)`,
        [organizadorId]
    );

    // Pedidos Recentes
    const [pedidosRecentes] = await db.query(
        `SELECT p.comprador_nome, p.comprador_email, p.valor_total, p.status_pagamento, p.data_pedido
        FROM pedidos p
        WHERE p.evento_id IN (
            SELECT id FROM eventos WHERE criado_por = ?
        )
        ORDER BY p.data_pedido DESC
        LIMIT 5`,
        [organizadorId]
    );

    // Próximos Eventos
    const [proximosEventos] = await db.query(
        `SELECT titulo AS nome, DATE_FORMAT(data_inicio, '%d/%m/%Y') AS data 
        FROM eventos 
        WHERE criado_por = ? AND data_inicio >= NOW() 
        ORDER BY data_inicio ASC 
        LIMIT 5`,
        [organizadorId]
    );

    res.json({
      nome_produtora,
      numero_eventos: eventosRows[0].total_eventos,
      ingressos_vendidos: ingressosRows[0].total_ingressos,
      pedidos_recentess: pedidosRecentes,
      proximos_eventos: proximosEventos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar dados do dashboard.' });
  }
};

/**
 * Endpoint para retornar os dados completos do organizador, incluindo primeiro_login_completo
 * Usado para forçar validação do modal no frontend
 */
exports.getOrganizadorById = async (req, res) => {
  const organizadorId = req.params.id;

  try {
    const [rows] = await db.query(
      'SELECT id, nome_responsavel, nome_produtora, primeiro_login_completo FROM organizadores WHERE id = ?',
      [organizadorId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Organizador não encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar dados do organizador.' });
  }
};
