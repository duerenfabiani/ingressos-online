
import React from 'react';
import '../styles/ConfirmacaoModal.css';

const ConfirmacaoModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="check-icon">✅</span>
        <h2>Cadastro realizado com sucesso!</h2>
        <p>
          Seu cadastro será analisado e em poucas horas você receberá um e-mail com as instruções de acesso.
        </p>
        <button onClick={onClose} className="close-button">Fechar</button>
      </div>
    </div>
  );
};

export default ConfirmacaoModal;
