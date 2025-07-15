import React, { useState } from 'react';
import QRCode from 'react-qr-code';

export default function App() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState('');
  const [mensagemValidacao, setMensagemValidacao] = useState('');

  const validarEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCodigo('');
    setMensagemValidacao('');

    if (!nome || !email) {
      setErro('Nome e email são obrigatórios.');
      return;
    }

    if (!validarEmail(email)) {
      setErro('Email inválido.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, telefone }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.erro || 'Erro no servidor');
        return;
      }

      setCodigo(data.codigo);
    } catch (error) {
      setErro('Erro ao conectar com o servidor.');
    }
  };

  const validarCodigo = async () => {
    setMensagemValidacao('');
    if (!codigo) return;

    try {
      const res = await fetch('http://localhost:4000/api/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo }),
      });
      const data = await res.json();
      setMensagemValidacao(data.mensagem);
    } catch {
      setMensagemValidacao('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div style={{
      maxWidth: 420,
      margin: '2rem auto',
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f7f9fc'
    }}>
      <h2 style={{ textAlign: 'center' }}>Cadastro de Cliente</h2>

      {!codigo && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {erro && <p style={{ color: 'red', fontWeight: 'bold' }}>{erro}</p>}

          <input
            type="text"
            placeholder="Nome completo"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />

          <input
            type="tel"
            placeholder="Telefone (opcional)"
            value={telefone}
            onChange={e => setTelefone(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />

          <button
            type="submit"
            style={{
              backgroundColor: '#007bff',
              color: '#fff',
              padding: '10px',
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Cadastrar
          </button>
        </form>
      )}

      {codigo && (
        <div style={{ textAlign: 'center' }}>
          <h3>Cadastro realizado!</h3>
          <p>Seu ingresso:</p>
          <QRCode value={codigo} size={180} />
          <p style={{ wordBreak: 'break-word' }}>{codigo}</p>

          <button
            onClick={validarCodigo}
            style={{
              marginTop: '1rem',
              backgroundColor: '#28a745',
              color: '#fff',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Validar Ingresso
          </button>

          {mensagemValidacao && (
            <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{mensagemValidacao}</p>
          )}
        </div>
      )}
    </div>
  );
}
