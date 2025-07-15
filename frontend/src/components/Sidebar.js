import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';
import {
  FaHome, FaTicketAlt, FaClipboardList, FaUsers, FaMoneyBillWave,
  FaCog, FaCheckSquare, FaQuestionCircle, FaChevronDown, FaChevronUp, FaBars
} from 'react-icons/fa';
import logo from '../assets/images/logo360.png';

export default function Sidebar({ collapsed, toggleCollapsed }) {
  const [openMenuPrincipal, setOpenMenuPrincipal] = useState(true);
  const [openFerramentas, setOpenFerramentas] = useState(true);

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <img src={logo} alt="Logo" className="sidebar-logo" />}
        <button className="sidebar-toggle" onClick={toggleCollapsed} aria-label="Alternar Menu">
          <FaBars />
        </button>
      </div>

      <ul className="sidebar-menu">
        {/* Seção: Menu Principal */}
        <li className="sidebar-section-title" onClick={() => setOpenMenuPrincipal(!openMenuPrincipal)}>
          {!collapsed && <span className="section-text">Menu Principal</span>}
          <span className="chevron-icon">
            {openMenuPrincipal ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        </li>
        {openMenuPrincipal && (
          <>
            <li>
              <Link to="/dashboard">
                <FaHome className="icon" /> <span className="link-text">Painel</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/ingressos">
                <FaTicketAlt className="icon" /> <span className="link-text">Ingressos</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/pedidos">
                <FaClipboardList className="icon" /> <span className="link-text">Pedidos</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/participantes">
                <FaUsers className="icon" /> <span className="link-text">Participantes</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/financeiro">
                <FaMoneyBillWave className="icon" /> <span className="link-text">Financeiro</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/customizar">
                <FaCog className="icon" /> <span className="link-text">Customizar</span>
              </Link>
            </li>
          </>
        )}

        {/* Seção: Ferramentas de Eventos */}
        <li className="sidebar-section-title" onClick={() => setOpenFerramentas(!openFerramentas)}>
          {!collapsed && <span className="section-text">Ferramentas de Eventos</span>}
          <span className="chevron-icon">
            {openFerramentas ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        </li>
        {openFerramentas && (
          <>
            <li>
              <Link to="/dashboard/check-in">
                <FaCheckSquare className="icon" /> <span className="link-text">Check-in</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/perguntas">
                <FaQuestionCircle className="icon" /> <span className="link-text">Perguntas</span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
