import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';
import {
  FaHome, FaTicketAlt, FaClipboardList, FaUsers, FaMoneyBillWave,
  FaCog, FaCheckSquare, FaQuestionCircle, FaChevronDown, FaChevronUp, FaBars,
  FaArrowLeft, FaBullhorn, FaUserFriends, FaCode
} from 'react-icons/fa';
import logo from '../assets/images/logo360.png';

export default function Sidebar({ collapsed, toggleCollapsed, isEventoMenu = false, nomeProdutora = '', eventoId = '' }) {
  const [openMenuPrincipal, setOpenMenuPrincipal] = useState(true);
  const [openFerramentas, setOpenFerramentas] = useState(true);
  const BASE_URL = process.env.REACT_APP_FRONTEND_URL || '';

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <img src={logo} alt="Logo" className="sidebar-logo" />}
        <button className="sidebar-toggle" onClick={toggleCollapsed} aria-label="Alternar Menu">
          <FaBars />
        </button>
      </div>

      <ul className="sidebar-menu">

        {/* 📌 ------------------------  MODO GERAL  ------------------------ */}
        {!isEventoMenu && (
          <>
            <li>
              <Link to="/dashboard">
                <FaHome className="icon" /> <span className="link-text">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/eventos">
                <FaTicketAlt className="icon" /> <span className="link-text">Eventos</span>
              </Link>
            </li>
            <li>
              <Link to="/usuarios">
                <FaUsers className="icon" /> <span className="link-text">Usuários</span>
              </Link>
            </li>
            <li>
              <Link to="/customizar">
                <FaCog className="icon" /> <span className="link-text">Customizar</span>
              </Link>
            </li>
            <li>
              <a href="https://ajuda.seusite.com" target="_blank" rel="noreferrer">
                <FaQuestionCircle className="icon" /> <span className="link-text">Ajuda</span>
              </a>
            </li>
          </>
        )}

        {/* 📌 ------------------------  MODO EVENTO  ------------------------ */}
        {isEventoMenu && (
          <>
            <li>
              <Link to="/eventos">
                <FaArrowLeft className="icon" /> <span className="link-text">Voltar para {nomeProdutora}</span>
              </Link>
            </li>

            {/* Menu Principal */}
            <li className="sidebar-section-title" onClick={() => setOpenMenuPrincipal(!openMenuPrincipal)}>
              {!collapsed && <span className="section-text">Menu Principal</span>}
              <span className="chevron-icon">
                {openMenuPrincipal ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </li>

            {openMenuPrincipal && (
              <>
                <li>
                  <Link to={`/eventos/${eventoId}/editar/painel`}>
                    <FaHome className="icon" /> <span className="link-text">Painel</span>
                  </Link>
                </li>
                <li>
                  <Link to={`/eventos/${eventoId}/editar/ingressos`}>
                    <FaTicketAlt className="icon" /> <span className="link-text">Ingressos</span>
                  </Link>
                </li>
                <li>
                  <Link to={`/eventos/${eventoId}/editar/pedidos`}>
                    <FaClipboardList className="icon" /> <span className="link-text">Pedidos</span>
                  </Link>
                </li>
                <li>
                  <Link to={`/eventos/${eventoId}/editar/participantes`}>
                    <FaUsers className="icon" /> <span className="link-text">Participantes</span>
                  </Link>
                </li>
                <li>
                  <Link to={`/eventos/${eventoId}/editar/financeiro`}>
                    <FaMoneyBillWave className="icon" /> <span className="link-text">Financeiro</span>
                  </Link>
                </li>
                <li>
                  <Link to={`/eventos/${eventoId}/editar/detalhamento`}>
                    <FaClipboardList className="icon" /> <span className="link-text">Detalhamento</span>
                  </Link>
                </li>
                <li>
                  <Link to={`/eventos/${eventoId}/editar/customizar`}>
                    <FaCog className="icon" /> <span className="link-text">Customizar</span>
                  </Link>
                </li>
              </>
            )}

            {/* Ferramentas de Eventos */}
            <li className="sidebar-section-title" onClick={() => setOpenFerramentas(!openFerramentas)}>
              {!collapsed && <span className="section-text">Ferramentas de Eventos</span>}
              <span className="chevron-icon">
                {openFerramentas ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </li>

            {openFerramentas && (
              <>
                <li>
                  <Link to={`/eventos/${eventoId}/editar/marketing`}>
                    <FaBullhorn className="icon" /> <span className="link-text">Marketing</span>
                  </Link>
                </li>
                <li>
                  <a
                    href={`${BASE_URL}/evento/${eventoId}/checkin`}
                    rel="noopener noreferrer"
                  >
                    <FaCheckSquare className="icon" /> <span className="link-text">Check-in</span>
                  </a>
                </li>
                <li>
                  <Link to={`/eventos/${eventoId}/editar/promoters`}>
                    <FaUserFriends className="icon" /> <span className="link-text">Promoters</span>
                  </Link>
                </li>
                <li>
                  <Link to={`/eventos/${eventoId}/editar/perguntas`}>
                    <FaQuestionCircle className="icon" /> <span className="link-text">Perguntas</span>
                  </Link>
                </li>
                <li>
                  <Link to={`/eventos/${eventoId}/editar/codigos-acesso`}>
                    <FaCode className="icon" /> <span className="link-text">Códigos de acesso</span>
                  </Link>
                </li>
                <li>
                  <Link to={`/eventos/${eventoId}/editar/ajuda`}>
                    <FaQuestionCircle className="icon" /> <span className="link-text">Ajuda</span>
                  </Link>
                </li>
              </>
            )}
          </>
        )}
      </ul>
    </div>
  );
}
