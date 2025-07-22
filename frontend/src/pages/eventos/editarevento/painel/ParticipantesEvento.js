import React, { useEffect, useState } from 'react';
import '../../../../styles/ParticipantesEvento.css';

export default function ParticipantesEvento({ eventoId }) {
  const [participantes, setParticipantes] = useState([]);
  const [ingressos, setIngressos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    ingressoId: '',
    nome: '',
    sobrenome: '',
    email: '',
    enviarConvite: true
  });

  useEffect(() => {
    fetch(`http://localhost:4000/api/participantes?evento_id=${eventoId}`)
      .then(res => res.json())
      .then(setParticipantes)
      .catch(console.error);

    fetch(`http://localhost:4000/api/ingressos?evento_id=${eventoId}`)
      .then(res => res.json())
      .then(setIngressos)
      .catch(console.error);
  }, [eventoId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/api/participantes/convidar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, eventoId })
      });

      if (!response.ok) throw new Error('Erro ao convidar participante');

      alert('Convite enviado com sucesso!');
      setShowModal(false);
    } catch (err) {
      alert('Erro ao enviar convite');
      console.error(err);
    }
  };

  return (
    <div className="participantes-container">
      <div className="header">
        <h2>Participantes</h2>
        <button onClick={() => setShowModal(true)}>Convidar Participante</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Ingresso</th>
            <th>Referência</th>
          </tr>
        </thead>
        <tbody>
          {participantes.map((p, index) => (
            <tr key={index}>
              <td>{p.nome} {p.sobrenome}</td>
              <td>{p.email}</td>
              <td>{p.titulo_ingresso}</td>
              <td>{p.referencia}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Convidar Participante</h3>
            <form onSubmit={handleSubmit}>
              <label>Ingresso:
                <select name="ingressoId" value={form.ingressoId} onChange={handleChange} required>
                  <option value="">-----Selecione o ingresso-----</option>
                  {ingressos.map(ing => (
                    <option key={ing.id} value={ing.id}>{ing.titulo}</option>
                  ))}
                </select>
              </label>

              <label>Nome:
                <input type="text" name="nome" value={form.nome} onChange={handleChange} required />
              </label>

              <label>Sobrenome:
                <input type="text" name="sobrenome" value={form.sobrenome} onChange={handleChange} required />
              </label>

              <label>Endereço de email:
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </label>

              <label>
                <input type="checkbox" name="enviarConvite" checked={form.enviarConvite} onChange={handleChange} />
                Enviar convite e ingresso para o participante.
              </label>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit">Convidar Participante</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
