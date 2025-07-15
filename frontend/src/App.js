import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import EventosDestaque from './components/EventosDestaque';
import CompraIngresso from './components/CompraIngresso';
import Organizadores from './components/Organizadores';
import RecuperarConta from './components/RecuperarConta';
import RedefinirSenha from './components/RedefinirSenha';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';

import PublicLayout from './components/PublicLayout';
import DashboardLayout from './components/DashboardLayout';

import ClienteLogin from './components/ClienteLogin';
import ClienteCadastro from './components/ClienteCadastro';

import './styles/Home.css';

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventos, setEventos] = useState([]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    fetchEventosParaData(date);
  };

  const fetchEventosParaData = (selectedDate) => {
    fetch(`http://localhost:4000/api/eventos?date=${selectedDate}`)
      .then((response) => response.json())
      .then((data) => setEventos(data))
      .catch((error) => console.error('Erro ao carregar eventos:', error));
  };

  useEffect(() => {
    fetch('http://localhost:4000/api/eventos')
      .then((response) => response.json())
      .then((data) => setEventos(data))
      .catch((error) => console.error('Erro ao carregar eventos:', error));
  }, []);

  return (
    <Routes>
      {/* Layout Público com Header e Footer */}
      <Route element={<PublicLayout />}>
        <Route
          index
          element={
            <>
              <EventosDestaque eventos={eventos} />
            </>
          }
        />
        <Route path="compra-ingresso" element={<CompraIngresso />} />
        <Route path="organizadores" element={<Organizadores />} />
        <Route path="recuperar-conta" element={<RecuperarConta />} />
        <Route path="redefinir-senha" element={<RedefinirSenha />} />
        <Route path="login" element={<Login />} />
        <Route path="/cliente-login" element={<ClienteLogin />} />
        <Route path="/cliente-cadastro" element={<ClienteCadastro />} />
      </Route>

      {/* Área Protegida (Dashboard) */}
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        {/* Sub-rotas protegidas do dashboard */}
      </Route>
    </Routes>
  );
}

export default App;
