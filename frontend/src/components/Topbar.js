// src/components/TopBar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Topbar.css';
import { FaSignOutAlt } from 'react-icons/fa';

export default function TopBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpa dados de login
    localStorage.removeItem('usuario');
    // Redireciona para página inicial
    navigate('/');
  };

  return (
    <div className="topbar">
      <div className="topbar-title">Painel do Organizador</div>
      <button className="logout-button" onClick={handleLogout}>
        <FaSignOutAlt className="logout-icon" />
        <span className="logout-text">Sair</span>
      </button>
    </div>
  );
}
