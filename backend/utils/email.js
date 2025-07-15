// IMPORTAÇÕES BÁSICAS
const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const { enviarEmailIngresso } = require('./utils/email');

// BANCO DE DADOS
const db = require('./models/db');

// MERCADOPAGO CONFIG
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
  sandbox: true
});

// IMPORTAÇÃO DAS ROTAS
const authRoutes = require('./routes/authRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const ingressoRoutes = require('./routes/ingressoRoutes');
const loteRoutes = require('./routes/loteRoutes');

// CRIAÇÃO DO APP
const app = express();
const PORT = process.env.PORT || 4000;

// MIDDLEWARES GLOBAIS
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve imagens e arquivos

// ROTAS PRINCIPAIS
app.use('/api/auth', authRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/ingressos', ingressoRoutes);
app.use('/api/lotes', loteRoutes);

// ROTA TESTE
app.get('/', (req, res) => {
  res.send('✅ API de ingressos online está no ar!');
});

// ROTA PARA OBTER LOTES DE UM EVENTO
app.get('/api/eventos/:evento_id/lotes', async (req, res) => {
  const evento_id = req.params.evento_id;

  try {
    const [lotes] = await db.query(
      'SELECT * FROM lotes WHERE evento_id = ?', 
      [evento_id]
    );
    res.json(lotes);
  } catch (error) {
    console.error('❌ Erro ao buscar lotes:', error);
    res.status(500).json({ erro: 'Erro ao buscar lotes' });
  }
});

// ✅ ROTA WEBHOOK MERCADOPAGO
app.post('/webhook', express.json(), async (req, res) => {
  const { topic, id } = req.query;

  console.log('⚡ Webhook recebido');
  console.log('Query:', req.query);
  console.log('Body:', req.body);

  if (topic === 'payment') {
    try {
      const payment = await mercadopago.payment.findById(id);
      const paymentStatus = payment.body.status;
      const preferenceId = payment.body.preference_id;

      console.log(`✅ Pagamento recebido preference_id=${preferenceId}, status=${paymentStatus}`);

      if (paymentStatus === 'approved') {
        await processarIngressosAprovados(preferenceId);
      }

      res.status(200).send('Webhook recebido');
    } catch (error) {
      console.error('❌ Erro ao buscar pagamento no webhook:', error);
      res.status(200).send('Erro processando pagamento');
    }
  } else {
    res.status(400).send('Tópico desconhecido');
  }
});

// ✅ Função para processar ingressos após pagamento aprovado
async function processarIngressosAprovados(preferenceId) {
  const [ingressos] = await db.query(
    `SELECT * FROM ingressos WHERE preference_id = ? AND status = 'pendente'`,
    [preferenceId]
  );

  if (!ingressos.length) {
    console.log('⚠️ Nenhum ingresso pendente encontrado.');
    return;
  }

  for (const ingresso of ingressos) {
    const codigoUnico = uuidv4();

    // Gera QR Code imagem
    const qrDir = path.join(__dirname, 'uploads', 'qrcodes');
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
    }
    const qrPath = path.join(qrDir, `${codigoUnico}.png`);

    await QRCode.toFile(qrPath, codigoUnico);

    // Salva no banco
    await db.query(
      `UPDATE ingressos SET status = 'pago', codigo_unico = ?, qr_code = ? WHERE id = ?`,
      [codigoUnico, `/uploads/qrcodes/${codigoUnico}.png`, ingresso.id]
    );

    // Envia e-mail
    await enviarEmailIngresso({
      to: ingresso.participante_email,
      nome: ingresso.participante_nome,
      evento: ingresso.evento_id,
      qrPath
    });

    console.log(`✅ QR gerado e e-mail enviado para ${ingresso.participante_email}`);
  }
}

// INICIALIZAÇÃO DO SERVIDOR
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
