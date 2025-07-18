import React, { useState, useEffect } from 'react';
import '../styles/Eventos.css';
import ModalCriarEvento from '../components/ModalCriarEvento';
import { useNavigate } from 'react-router-dom';

export default function Eventos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [eventos, setEventos] = useState([]);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const organizadorId = usuario ? usuario.id : null;
const navigate = useNavigate();

  useEffect(() => {
    if (!organizadorId) return;
    setCarregando(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/eventos?criado_por=${organizadorId}`)
      .then(res => res.json())
      .then(data => {
        setEventos(data);
        setFilteredEventos(data);
      })
      .catch(err => console.error('Erro ao carregar eventos:', err))
      .finally(() => setCarregando(false));
  }, [organizadorId]);

  useEffect(() => {
    filtrarEventos();
  }, [searchTerm, dateFilter, eventos]);

  const filtrarEventos = () => {
    let resultados = [...eventos];

    if (searchTerm.trim()) {
      resultados = resultados.filter(e =>
        e.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter) {
      resultados = resultados.filter(e =>
        e.data_inicio.startsWith(dateFilter)
      );
    }

    setFilteredEventos(resultados);
  };

  const limparFiltros = () => {
    setSearchTerm('');
    setDateFilter('');
    setFilteredEventos(eventos);
  };

  const formatData = (dataISO) => {
    const date = new Date(dataISO);
    const mes = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const dia = String(date.getDate()).padStart(2, '0');
    return { mes, dia };
  };

  const renderTags = (tagString) => {
    if (!tagString) return null;
    return tagString
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
      .map((tag, idx) => (
        <span key={idx} className="badge">{tag}</span>
      ));
  };

  return (
    <div className="eventos-container">
      <div className="header-principal">
        <h1 className="titulo-pagina">
          Eventos de {usuario?.nome_produtora || 'Minha Produtora'}
        </h1>
        <button className="btn-criar-evento" onClick={() => setShowModal(true)}>
          + Cadastrar Evento
        </button>
      </div>

      {showModal && (
        <ModalCriarEvento onClose={() => setShowModal(false)} />
      )}

      <div className="barra-pesquisa">
        <input
          type="text"
          placeholder="Pesquisar eventos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <button onClick={limparFiltros}>Limpar</button>
      </div>

      {carregando ? (
        <p className="texto-vazio">Carregando...</p>
      ) : filteredEventos.length === 0 ? (
        <p className="texto-vazio">Nenhum evento encontrado.</p>
      ) : (
        <>
          {/* Eventos futuros */}
          <section className="sessao">
            <h2>Eventos que acontecerão</h2>
            <div className="eventos-grid">
              {filteredEventos
                .filter(e => new Date(e.data_inicio) >= new Date().setHours(0, 0, 0, 0))
                .map(evento => {
                  const { mes, dia } = formatData(evento.data_inicio);
                  return (
                    <div className="card-evento" key={evento.id}>
                      <div className="data-evento">
                        <span className="mes">{mes}</span>
                        <span className="dia">{dia}</span>
                      </div>
                      <div className="detalhes-evento">
                        <h3>{evento.titulo}</h3>
                        <div className="descricao" dangerouslySetInnerHTML={{ __html: evento.descricao }}></div>
                        <div className="categoria-tag">
                          {evento.categoria && <span className="badge">{evento.categoria}</span>}
                          {renderTags(evento.tag)}
                        </div>
                        <p className="local">📍 {evento.local}</p>
                        <div className="stats">
                          <span>🎟️ {evento.ingressos_vendidos || 0} Ingressos vendidos</span>
                          <span>💰 R${(evento.receita || 0).toFixed(2)}</span>
                        </div>
                        <div className="botoes">
                          <button className="btn-editar" onClick={() => navigate(`/eventos/${evento.id}/editar/customizar`)}>Editar</button>
                          <button className="btn-gerenciar" onClick={() => navigate(`/eventos/${evento.id}/editar/financeiro`)}>Gerenciar</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>

          {/* Todos os eventos */}
          <section className="sessao">
            <div className="header-sessao">
              <h2>Todos os eventos ({filteredEventos.length})</h2>
            </div>
            <div className="eventos-grid">
              {filteredEventos.map(evento => {
                const { mes, dia } = formatData(evento.data_inicio);
                return (
                  <div className="card-evento" key={evento.id}>
                    <div className="data-evento">
                      <span className="mes">{mes}</span>
                      <span className="dia">{dia}</span>
                    </div>
                    <div className="detalhes-evento">
                      <h3>{evento.titulo}</h3>
                      <div className="descricao" dangerouslySetInnerHTML={{ __html: evento.descricao }}></div>
                      <div className="categoria-tag">
                        {evento.categoria && <span className="badge">{evento.categoria}</span>}
                        {renderTags(evento.tag)}
                      </div>
                      <p className="local">📍 {evento.local}</p>
                      <div className="stats">
                        <span>🎟️ {evento.ingressos_vendidos || 0} Ingressos vendidos</span>
                        <span>💰 R${(evento.receita || 0).toFixed(2)}</span>
                      </div>
                      <div className="botoes">
                        <button className="btn-editar" onClick={() => navigate(`/eventos/${evento.id}/editar/customizar`)}>Editar</button>
                        <button className="btn-gerenciar" onClick={() => navigate(`/eventos/${evento.id}/editar/financeiro`)}>Gerenciar</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}