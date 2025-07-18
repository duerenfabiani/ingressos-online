import React, { useState, useEffect } from 'react';
import ModalPerfilOrganizador from '../components/ModalPerfilOrganizador';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [organizadorId, setOrganizadorId] = useState(null);
  const [nomeProdutora, setNomeProdutora] = useState('Minha Produtora');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const usuarioSalvo = JSON.parse(localStorage.getItem('usuario'));
    if (usuarioSalvo && usuarioSalvo.id) {
      setOrganizadorId(usuarioSalvo.id);
    } else {
      console.error('Nenhum usuário logado encontrado!');
      setShowModal(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!organizadorId) return;

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard/organizador/${organizadorId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error('Erro na API:', data.error);
          setShowModal(true);
          setLoading(false);
          return;
        }

        const primeiroLogin = Number(data.primeiro_login_completo);
        setNomeProdutora(data.nome_produtora || 'Minha Produtora');

        if (primeiroLogin === 0 || !data.nome_responsavel || data.nome_responsavel.trim() === '') {
          setShowModal(true);
          setLoading(false);
        } else {
          setShowModal(false);
          fetchDashboardData(organizadorId);
        }
      })
      .catch(err => {
        console.error('Erro ao buscar dados do organizador:', err);
        setShowModal(true);
        setLoading(false);
      });
  }, [organizadorId]);

  const fetchDashboardData = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard/${id}`);
      if (!response.ok) throw new Error('Erro ao carregar dashboard');
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      console.error('Erro ao buscar dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePerfil = () => {
    setShowModal(false);
    setLoading(true);
    window.location.reload();
  };

  if (loading) {
    return <div className="dashboard-container"><div className="loader">Carregando...</div></div>;
  }

  return (
    <div className="dashboard-container">
      {showModal && (
        <ModalPerfilOrganizador
          organizadorId={organizadorId}
          onSaveSuccess={handleSavePerfil}
        />
      )}

      {!showModal && dashboardData && (
        <div className="dashboard-content">
          <h1 className="dashboard-title">Dashboard <span className="produtora-name">{nomeProdutora}</span></h1>

          <div className="stats-cards">
            <div className="stats-card">
              <h3>Nº de Eventos</h3>
              <p className="stats-value">{dashboardData.numero_eventos}</p>
            </div>
            <div className="stats-card">
              <h3>Ingressos Vendidos</h3>
              <p className="stats-value">{dashboardData.ingressos_vendidos}</p>
            </div>
          </div>

          <div className="sections-grid">
            <div className="section-card">
              <h2>📦 Pedidos Recentes</h2>
              {dashboardData.pedidos_recentess.length ? (
                <ul className="list">
                  {dashboardData.pedidos_recentess.map((pedido, index) => (
                    <li key={index} className="list-item">
                      <strong>{pedido.comprador_nome}</strong><br />
                      <span>{pedido.comprador_email}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-text">Sem pedidos recentes.</p>
              )}
            </div>

            <div className="section-card">
              <h2>📅 Próximos Eventos</h2>
              {dashboardData.proximos_eventos.length ? (
                <ul className="list">
                  {dashboardData.proximos_eventos.map((evento, index) => (
                    <li key={index} className="list-item">
                      <strong>{evento.nome}</strong><br />
                      <span>{evento.data}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-text">Sem eventos futuros.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
