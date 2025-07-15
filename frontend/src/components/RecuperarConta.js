import React, { useState } from 'react';
import Modal from './Modal';
import '../styles/Modal.css';
import '../styles/RecuperarConta.css';

export default function RecuperarConta() {
  const [email, setEmail] = useState('');
  const [modalMensagem, setModalMensagem] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/api/organizadores/recuperar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('E-mail não encontrado. Verifique e tente novamente!');
        }
        throw new Error('Erro ao solicitar recuperação. Tente novamente.');
      }

      setModalMensagem('Verifique seu e-mail para redefinir a senha!');
      setShowModal(true);
      setEmail('');

    } catch (error) {
      setModalMensagem(error.message);
      setShowModal(true);
    }
  };

  return (
    <div className="recuperar-container">
      <h2>Recuperar Conta</h2>
      <p>Digite seu e-mail para receber um link de redefinição de senha.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar Link</button>
      </form>

      <Modal
        mensagem={modalMensagem}
        show={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
