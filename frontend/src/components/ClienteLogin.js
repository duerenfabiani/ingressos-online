// src/components/ClienteLogin.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from './Modal';
import '../styles/ClienteLogin.css';

export default function ClienteLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  // Simulador para Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Simulação de payload Google
      const payload = {
        nome: 'Nome do Google',
        email: 'usuario@google.com',
        googleId: 'google_123456'
      };

      const response = await fetch('http://localhost:4000/api/clientes/login/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Erro ao fazer login com Google');

      const data = await response.json();
      localStorage.setItem('cliente', JSON.stringify(data));
      navigate('/');

    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Simulador para Apple
  const handleAppleLogin = async () => {
    setLoading(true);
    try {
      const payload = {
        nome: 'Nome do Apple',
        email: 'usuario@apple.com',
        appleId: 'apple_123456'
      };

      const response = await fetch('http://localhost:4000/api/clientes/login/apple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Erro ao fazer login com Apple');

      const data = await response.json();
      localStorage.setItem('cliente', JSON.stringify(data));
      navigate('/');

    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Login tradicional
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      const response = await fetch('http://localhost:4000/api/clientes/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error('E-mail ou senha inválidos.');
        throw new Error('Erro ao fazer login.');
      }

      const data = await response.json();
      localStorage.setItem('cliente', JSON.stringify(data));
      navigate('/');
      
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cliente-login-container">
      <h2>Login do Cliente</h2>

      <button className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
        Entrar com o Google
      </button>

      <button className="apple-btn" onClick={handleAppleLogin} disabled={loading}>
        Entrar com a Apple
      </button>

      <div className="ou-separador">OU</div>

      <form onSubmit={handleEmailLogin}>
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <label htmlFor="senha">
          Senha
          <Link to="/cliente-recuperar" className="esqueceu-link">
            Esqueceu sua senha?
          </Link>
        </label>
        <input
          id="senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="criar-conta-link">
        <Link to="/cliente-cadastro">Criar uma conta</Link>
      </div>

      {erro && <Modal mensagem={erro} onClose={() => setErro('')} />}
    </div>
  );
}
