exports.getDashboard = async (req, res) => {
  const { id } = req.params;

  try {
    // 🔸 Métricas gerais
    const [metricasResult] = await db.query(`
      SELECT
        COALESCE(SUM(v.valor_total), 0) AS receita,
        COALESCE(SUM(v.quantidade), 0) AS vendidos,
        COALESCE(SUM(v.reservados), 0) AS reservados,
        e.visualizacoes
      FROM eventos e
      LEFT JOIN vendas v ON v.evento_id = e.id
      WHERE e.id = ?
    `, [id]);

    const metricas = metricasResult[0];

    // 🔸 Borderô
    const [bordero] = await db.query(`
      SELECT
        i.titulo AS descricao,
        i.preco AS valor_unit,
        i.quantidade,
        COALESCE(SUM(v.quantidade), 0) AS vendidos,
        COALESCE(SUM(v.reservados), 0) AS reservados,
        (i.preco * COALESCE(SUM(v.quantidade), 0)) AS valor_total,
        COALESCE(SUM(v.checkins), 0) AS checkins
      FROM ingressos i
      LEFT JOIN vendas v ON v.ingresso_id = i.id
      WHERE i.evento_id = ?
      GROUP BY i.id
    `, [id]);

    // 🔸 Histórico de visualizações por data
    const [visualizacoesRaw] = await db.query(`
      SELECT 
        DATE_FORMAT(data, '%d %b') AS data, 
        COUNT(*) AS total
      FROM visualizacoes_evento
      WHERE evento_id = ?
      GROUP BY DATE(data)
      ORDER BY data ASC
    `, [id]);

    // 🔸 Histórico de ingressos vendidos por dia
    const [vendidosHistorico] = await db.query(`
      SELECT 
        DATE_FORMAT(v.data, '%d %b') AS data,
        SUM(v.quantidade) AS total
      FROM vendas v
      WHERE v.evento_id = ?
      GROUP BY DATE(v.data)
      ORDER BY v.data ASC
    `, [id]);

    // 🔸 Histórico de valores vendidos por dia
    const [valoresHistorico] = await db.query(`
      SELECT 
        DATE_FORMAT(v.data, '%d %b') AS data,
        SUM(v.valor_total) AS total
      FROM vendas v
      WHERE v.evento_id = ?
      GROUP BY DATE(v.data)
      ORDER BY v.data ASC
    `, [id]);

    res.json({
      metricas,
      bordero,
      visualizacoesHistorico: visualizacoesRaw,
      vendidosHistorico,
      valoresHistorico
    });

  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do dashboard' });
  }
};
