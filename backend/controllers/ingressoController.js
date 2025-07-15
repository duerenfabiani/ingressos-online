const db = require('../models/db');
const mercadopago = require('mercadopago');

// Supondo que a configuração do mercadopago com access_token
// já está feita no arquivo principal (index.js), não precisa repetir aqui.

exports.comprarIngresso = async (req, res) => {
  const { evento_id, lote_id, quantidade, nome_cliente, cpf_cliente, email_cliente } = req.body;
  const usuario_id = req.usuario.id;

  try {
    const [[lote]] = await db.query('SELECT * FROM lotes WHERE id = ?', [lote_id]);

    if (!lote) {
      return res.status(400).json({ erro: 'Lote não encontrado.' });
    }

    // Verifica se o lote está dentro do período válido
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataInicio = new Date(lote.data_inicio);
    const dataFim = new Date(lote.data_fim);
    dataInicio.setHours(0, 0, 0, 0);
    dataFim.setHours(23, 59, 59, 999); // fim do dia para incluir o último dia

    if (hoje < dataInicio || hoje > dataFim) {
      return res.status(400).json({ erro: 'Lote fora do período de venda.' });
    }

    // Verifica estoque disponível
    const disponivel = lote.quantidade_total - lote.quantidade_vendida;
    if (quantidade > disponivel) {
      return res.status(400).json({ erro: 'Quantidade excede o disponível no lote.' });
    }

    const valor_total = lote.valor * quantidade;

    // Cria a preferência de pagamento no MercadoPago
    const preference = {
      items: [{
        title: `Ingresso para evento ${evento_id}`,
        quantity: quantidade,  // <-- corrige aqui
        unit_price: valorUnitario,
      }],
      back_urls: {
        success: 'http://localhost:3000/sucesso',
        failure: 'http://localhost:3000/erro',
        pending: 'http://localhost:3000/pendente',
      },
      auto_return: "approved",
      binary_mode: true // para aceitar só pagamento aprovado ou recusado (opcional)
    };

    const response = await mercadopago.preferences.create(preference);
    const preferenceId = response.body.id;  // Salva o ID da preferência para relacionar depois

    // Insere ingresso no banco com preference_id e status pendente
    const [result] = await db.query(`
      INSERT INTO ingressos (
        evento_id, lote_id, usuario_id, nome_cliente, cpf_cliente, email_cliente,
        quantidade, valor_unitario, valor_total, preference_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      evento_id, lote_id, usuario_id,
      nome_cliente, cpf_cliente, email_cliente,
      quantidade, lote.valor, valor_total, preferenceId, 'pendente'
    ]);

    // Atualiza quantidade vendida no lote
    await db.query(
      'UPDATE lotes SET quantidade_vendida = quantidade_vendida + ? WHERE id = ?',
      [quantidade, lote_id]
    );

    // Retorna dados para frontend
    return res.json({
      sucesso: 'Ingresso registrado. Redirecionar para pagamento.',
      ingresso_id: result.insertId,
      pagamento_url: response.body.init_point
    });

  } catch (err) {
    console.error('Erro ao registrar ingresso:', err);
    return res.status(500).json({ erro: 'Erro ao registrar ingresso.' });
  }
};
