const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const loteRoutes = require('./routes/loteRoutes');
const organizadoresRoutes = require('./routes/organizadoresRoutes');
const loginRoutes = require('./routes/loginRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const ingressosRoutes = require('./routes/criaingressoRoutes');
const dashboardEventoRoutes = require('./routes/dashboardEventoRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');
const participantesRoutes = require('./routes/participantesRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/lotes', loteRoutes);
app.use('/api/organizadores', organizadoresRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/ingressos', ingressosRoutes);
app.use('/api/eventos-dashboard', dashboardEventoRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/participantes', participantesRoutes);

app.use((req, res) => {
  res.status(404).send('Rota não encontrada');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
