import React, { useState, useEffect } from 'react';
import ModalPerfilOrganizador from './ModalPerfilOrganizador';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [organizadorId, setOrganizadorId] = useState(null);
  const [nomeProdutora, setNomeProdutora] = useState('Minha Produtora');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // ⚡ 1️⃣ Primeiro useEffect para pegar ID salvo no localStorage
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

  // ⚡ 2️⃣ Segundo useEffect para carregar dados do organizador e decidir abrir Modal
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
    // ⚡ Depois de salvar perfil, recarrega para validar no banco novamente
    window.location.reload();
  };

  if (loading) {
    return <div className="dashboard-container">Carregando...</div>;
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
        <>
          <h1 className="dashboard-title">Dashboard - {nomeProdutora}</h1>

          <div className="dashboard-cards">
            <div className="card">
              <h2>Nº Eventos</h2>
              <p>{dashboardData.numero_eventos}</p>
            </div>
            <div className="card">
              <h2>Ingressos Vendidos</h2>
              <p>{dashboardData.ingressos_vendidos}</p>
            </div>
          </div>

          <div className="dashboard-sections">
            <div className="section">
              <h2>Pedidos Recentes</h2>
              {dashboardData.pedidos_recentess.length ? (
                <ul>
                  {dashboardData.pedidos_recentess.map((pedido, index) => (
                    <li key={index}>
                      {pedido.comprador_nome} - {pedido.comprador_email}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Sem pedidos recentes.</p>
              )}
            </div>

            <div className="section">
              <h2>Próximos Eventos</h2>
              {dashboardData.proximos_eventos.length ? (
                <ul>
                  {dashboardData.proximos_eventos.map((evento, index) => (
                    <li key={index}>
                      {evento.nome} - {evento.data}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Sem eventos futuros.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
