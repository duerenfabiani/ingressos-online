import React from 'react';
import '../styles/Modal.css';

export default function Modal({ mensagem, show, onClose, extraButton }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
        <div className="modal-content">
            <p>{mensagem}</p>
            <div className="modal-buttons">
                {extraButton}
                <button onClick={onClose}>Fechar</button>
            </div>
        </div>

    </div>
  );
}
