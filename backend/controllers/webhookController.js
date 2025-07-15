app.post('/webhook', express.json(), async (req, res) => {
  const topic = req.query.topic || req.body.topic;
  const id = req.query.id || req.body.id;

  if (topic === 'payment') {
    try {
      const payment = await mercadopago.payment.findById(id);
      const paymentStatus = payment.body.status;
      const preferenceId = payment.body.preference_id;

      console.log(`Pagamento recebido: preference_id = ${preferenceId}, status = ${paymentStatus}`);

      // Aqui você pode atualizar o banco de dados, exemplo:
      // await db.query('UPDATE ingressos SET status = ? WHERE preference_id = ?', [paymentStatus, preferenceId]);

      res.status(200).send('Webhook recebido');
    } catch (error) {
      console.error('Erro no webhook:', error);
      res.status(500).send('Erro no webhook');
    }
  } else {
    res.status(400).send('Tópico desconhecido');
  }
});
