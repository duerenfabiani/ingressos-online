import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import PublicLayout from './components/PublicLayout';
import DashboardLayout from './components/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';

// Public Pages
import EventosDestaque from './components/EventosDestaque';
import CompraIngresso from './components/CompraIngresso';
import Organizadores from './components/Organizadores';
import RecuperarConta from './components/RecuperarConta';
import RedefinirSenha from './components/RedefinirSenha';
import Login from './components/Login';
import ClienteLogin from './components/ClienteLogin';
import ClienteCadastro from './components/ClienteCadastro';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import Eventos from './pages/Eventos';
import EditarEvento from './pages/eventos/editarevento/EditarEvento';
import Usuarios from './pages/Usuarios';
import Customizar from './pages/Customizar';
import RedirecionaAjuda from './pages/RedirecionaAjuda';

// Evento SubPages
import PainelEvento from './pages/eventos/editarevento/painel/PainelEvento';
import IngressosEvento from './pages/eventos/editarevento/painel/IngressosEvento';
import PedidosEvento from './pages/eventos/editarevento/painel/PedidosEvento';
import ParticipantesEvento from './pages/eventos/editarevento/painel/ParticipantesEvento';
import FinanceiroEvento from './pages/eventos/editarevento/painel/FinanceiroEvento';
import DetalhamentoEvento from './pages/eventos/editarevento/painel/DetalhamentoEvento';
import CustomizarEvento from './pages/eventos/editarevento/painel/CustomizarEvento';

import Marketing from './pages/eventos/ferramentas/Marketing';
import Promoters from './pages/eventos/ferramentas/Promoters';
import Perguntas from './pages/eventos/ferramentas/Perguntas';
import CodigosAcesso from './pages/eventos/ferramentas/CodigosAcesso';
import AjudaEvento from './pages/eventos/ferramentas/AjudaEvento';

// Check-in exclusivo (sem layout)
import CheckInPage from './pages/eventos/editarevento/painel/CheckIn';

import './styles/Home.css';

function App() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/eventos')
      .then((response) => response.json())
      .then((data) => setEventos(data))
      .catch((error) => console.error('Erro ao carregar eventos:', error));
  }, []);

  return (
    <Routes>
      {/* Layout Público */}
      <Route element={<PublicLayout />}>
        <Route index element={<EventosDestaque eventos={eventos} />} />
        <Route path="compra-ingresso" element={<CompraIngresso />} />
        <Route path="organizadores" element={<Organizadores />} />
        <Route path="recuperar-conta" element={<RecuperarConta />} />
        <Route path="redefinir-senha" element={<RedefinirSenha />} />
        <Route path="login" element={<Login />} />
        <Route path="cliente-login" element={<ClienteLogin />} />
        <Route path="cliente-cadastro" element={<ClienteCadastro />} />
      </Route>

      {/* Área Protegida com DashboardLayout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="eventos" element={<Eventos />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="customizar" element={<Customizar />} />
        <Route path="ajuda" element={<RedirecionaAjuda />} />

        <Route path="eventos/:id/editar" element={<EditarEvento />}>
          <Route path="painel" element={<PainelEvento />} />
          <Route path="ingressos" element={<IngressosEvento />} />
          <Route path="pedidos" element={<PedidosEvento />} />
          <Route path="participantes" element={<ParticipantesEvento />} />
          <Route path="financeiro" element={<FinanceiroEvento />} />
          <Route path="detalhamento" element={<DetalhamentoEvento />} />
          <Route path="customizar" element={<CustomizarEvento />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="promoters" element={<Promoters />} />
          <Route path="perguntas" element={<Perguntas />} />
          <Route path="codigos-acesso" element={<CodigosAcesso />} />
          <Route path="ajuda" element={<AjudaEvento />} />
        </Route>
      </Route>

      {/* Rota de Check-in (sem menu lateral) */}
      <Route
        path="/evento/:id/checkin"
        element={
          <PrivateRoute>
            <CheckInPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
