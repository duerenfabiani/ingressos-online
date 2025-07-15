import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet, useNavigate } from 'react-router-dom';
import '../styles/DashboardLayout.css';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <div className={`dashboard-layout ${collapsed ? 'collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} toggleCollapsed={() => setCollapsed(!collapsed)} />
      <div className="dashboard-main">
        <Topbar onLogout={handleLogout} />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
