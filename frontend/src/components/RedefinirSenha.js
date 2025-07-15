import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Modal from './Modal'; // seu componente de modal genérico
import '../styles/RedefinirSenha.css';

export default function RedefinirSenha() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [showModal, setShowModal] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setErro('');
  setSucesso('');
  setShowModal(false);

  if (!senha || !confirmar) {
    setErro('Por favor preencha todos os campos.');
    setShowModal(true);
    return;
  }

  if (senha !== confirmar) {
    setErro('As senhas não coincidem.');
    setShowModal(true);
    return;
  }

  try {
    const response = await fetch('http://localhost:4000/api/organizadores/redefinir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, senha })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Link inválido ou expirado.');
    }

    setSucesso(data.message || 'Senha redefinida com sucesso!');
    setShowModal(true);

    setTimeout(() => navigate('/login'), 3000);

  } catch (err) {
    setErro(err.message);
    setShowModal(true);
  }
};


return (
  <div className="redefinir-container">
    <h2>Redefinir Senha</h2>

    <form onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="Nova senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirme a nova senha"
        value={confirmar}
        onChange={(e) => setConfirmar(e.target.value)}
        required
      />
      <button type="submit">Salvar Nova Senha</button>
    </form>

    {/* ✅ AQUI! */}
    <Modal
      mensagem={erro || sucesso}
      show={showModal}
      onClose={() => {
        setShowModal(false);
        setErro('');
        setSucesso('');
      }}
    />
  </div>
);

}
