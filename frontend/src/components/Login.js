import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Modal from './Modal';
import '../styles/Login.css';
import logo from '../assets/images/logo360_cinza.png'; // Ajuste conforme seu projeto

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setShowModal(false);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('E-mail ou senha inválidos.');
        }
        throw new Error('Erro ao tentar fazer login.');
      }

      const data = await response.json();
      localStorage.setItem('usuario', JSON.stringify(data));
      navigate('/dashboard');

    } catch (err) {
      setErro(err.message);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Logo" className="login-logo" />

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="senha">
            Senha
            <Link to="/recuperar-conta" className="esqueceu-link">
              Esqueceu sua senha?
            </Link>
          </label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <Modal
        mensagem={erro}
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setErro('');
        }}
      />
    </div>
  );
}

export default Login;
