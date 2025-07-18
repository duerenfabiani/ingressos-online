import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import '../styles/DashboardLayout.css';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detectar se estamos na edição de evento
  const isEventoMenu = location.pathname.startsWith('/eventos/') && location.pathname.includes('/editar');
  const match = location.pathname.match(/\/eventos\/(\d+)\/editar/);
  const eventoId = match ? match[1] : '';

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const nomeProdutora = usuario?.nome_produtora || '';

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <div className={`dashboard-layout ${collapsed ? 'collapsed' : ''}`}>
      <Sidebar
        key={isEventoMenu ? `evento-${eventoId}` : 'geral'} // Força recriação do Sidebar
        collapsed={collapsed}
        toggleCollapsed={() => setCollapsed(!collapsed)}
        isEventoMenu={isEventoMenu}
        eventoId={eventoId}
        nomeProdutora={nomeProdutora}
      />
      <div className="dashboard-main">
        <Topbar onLogout={handleLogout} />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
