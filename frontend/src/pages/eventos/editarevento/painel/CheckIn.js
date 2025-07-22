// src/pages/eventos/editarevento/painel/CheckIn.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../../../styles/CheckIn.css';
import { FaQrcode } from 'react-icons/fa';
import CheckInCamera from '../../../../pages/eventos/editarevento/painel/CheckInCamera';

export default function CheckIn() {
  const { id: eventoId } = useParams();
  const [participantes, setParticipantes] = useState([]);
  const [busca, setBusca] = useState('');
  const [cameraAberta, setCameraAberta] = useState(false);

  useEffect(() => {
    const fetchParticipantes = () => {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/participantes/${eventoId}`)
        .then(res => res.json())
        .then(data => {
          setParticipantes(data || []);
        })
        .catch(() => setParticipantes([]));
    };
    fetchParticipantes();
    const interval = setInterval(fetchParticipantes, 5000);
    return () => clearInterval(interval);
  }, [eventoId]);

  const participantesFiltrados = participantes.filter(p =>
    p.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    p.email?.toLowerCase().includes(busca.toLowerCase()) ||
    p.referencia?.toLowerCase().includes(busca.toLowerCase())
  );

  const alternarCheckin = async (id) => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/participantes/${id}/checkin`, { method: 'PUT' });
    const atualizados = participantes.map(p =>
      p.id === id ? { ...p, checkin: !p.checkin } : p
    );
    setParticipantes(atualizados);
  };

  return (
    <div className="checkin-container">
      <header className="checkin-header">
        <FaQrcode size={30} onClick={() => setCameraAberta(true)} style={{ cursor: 'pointer' }} />
        <input
          type="text"
          placeholder="Buscar participante..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
      </header>

      <h4 className="checkin-title">
        Todos os participantes ({participantes.filter(p => p.checkin).length}/{participantes.length})
      </h4>

      <div className="checkin-list">
        {participantesFiltrados.map(p => (
          <div
            key={p.id}
            className={`checkin-item ${p.checkin ? 'checked-in' : 'checked-out'}`}
            onClick={() => alternarCheckin(p.id)}
          >
            <button className="btn-success">✔</button>
            <div>
              <p><strong>Nome:</strong> {p.nome}</p>
              <p><strong>Referência:</strong> {p.referencia}</p>
              <p><strong>Ingresso:</strong> {p.ingresso}</p>
            </div>
          </div>
        ))}
      </div>

      {cameraAberta && <CheckInCamera onClose={() => setCameraAberta(false)} />}
    </div>
  );
}
