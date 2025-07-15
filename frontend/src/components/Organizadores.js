import React, { useState } from 'react';
import Modal from './Modal';
import '../styles/Modal.css';
import './Organizadores.css';
import { useNavigate } from 'react-router-dom';

const Organizadores = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nomeResponsavel: '',
    celularResponsavel: '',
    cpfResponsavel: '',
    emailResponsavel: '',
    confirmarEmailResponsavel: '',
    nomeProdutora: '',
    cnpjProdutora: '',
    instagramProdutora: '',
    eventosRealizados: '',
    plataformaVenda: '',
    faturamento: '',
    chavePix: '',
    cep: '',
    bairro: '',
    rua: '',
    numero: '',
    complemento: '',
    cidade: '',
    estado: ''
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMensagem, setModalMensagem] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.emailResponsavel !== formData.confirmarEmailResponsavel) {
      setModalMensagem('Os e-mails não coincidem.');
      setShowModal(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/organizadores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.status === 409) {
        setModalMensagem('E-mail já cadastrado. Você pode recuperar sua conta!');
        setShowModal(true);
        return;
      }

      if (!response.ok) {
        throw new Error();
      }

      setModalMensagem('Cadastro realizado com sucesso! Seu cadastro será analisado e você receberá um e-mail.');
      setShowModal(true);

      setFormData({
        nomeResponsavel: '',
        celularResponsavel: '',
        cpfResponsavel: '',
        emailResponsavel: '',
        confirmarEmailResponsavel: '',
        nomeProdutora: '',
        cnpjProdutora: '',
        instagramProdutora: '',
        eventosRealizados: '',
        plataformaVenda: '',
        faturamento: '',
        chavePix: '',
        cep: '',
        bairro: '',
        rua: '',
        numero: '',
        complemento: '',
        cidade: '',
        estado: ''
      });

    } catch {
      setModalMensagem('Erro ao cadastrar. Tente novamente!');
      setShowModal(true);
    }
  };

  let extraButton = null;
  if (modalMensagem.includes('E-mail já cadastrado')) {
    extraButton = (
      <button
        className="modal-extra-button"
        onClick={() => {
          setShowModal(false);
          navigate('/recuperar-conta');
        }}
      >
        Recuperar Conta
      </button>
    );
  }

  return (
    <div className="organizadores-container">
      <Modal
        mensagem={modalMensagem}
        show={showModal}
        onClose={() => setShowModal(false)}
        extraButton={extraButton}
      />

      <h2>Cadastro de Organizador</h2>

      <form onSubmit={handleSubmit}>

        <h3 className="section-title">Dados do Responsável</h3>
        <div className="form-section grid-2-cols">
          <div className="form-group">
            <label>Nome do Responsável</label>
            <input type="text" name="nomeResponsavel" value={formData.nomeResponsavel} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Celular do Responsável</label>
            <input type="text" name="celularResponsavel" value={formData.celularResponsavel} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>CPF do Responsável</label>
            <input type="text" name="cpfResponsavel" value={formData.cpfResponsavel} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>E-mail do Responsável</label>
            <input type="email" name="emailResponsavel" value={formData.emailResponsavel} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Confirme o E-mail do Responsável</label>
            <input type="email" name="confirmarEmailResponsavel" value={formData.confirmarEmailResponsavel} onChange={handleChange} required />
          </div>
        </div>

        <h3 className="section-title">Informações da Produtora</h3>
        <div className="form-section grid-2-cols">
          <div className="form-group">
            <label>Nome da Produtora</label>
            <input type="text" name="nomeProdutora" value={formData.nomeProdutora} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>CNPJ da Produtora</label>
            <input type="text" name="cnpjProdutora" value={formData.cnpjProdutora} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Instagram da Produtora</label>
            <input type="text" name="instagramProdutora" value={formData.instagramProdutora} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Eventos que já realizou</label>
            <input type="text" name="eventosRealizados" value={formData.eventosRealizados} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Plataforma para Venda de Ingressos</label>
            <input type="text" name="plataformaVenda" value={formData.plataformaVenda} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Faturamento Médio por Evento *</label>
            <select name="faturamento" value={formData.faturamento} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="R$0 até R$5.000">R$0 até R$5.000</option>
              <option value="R$5.001 até R$20.000">R$5.001 até R$20.000</option>
              <option value="R$20.001 até R$50.000">R$20.001 até R$50.000</option>
              <option value="R$50.001 até R$100.000">R$50.001 até R$100.000</option>
              <option value="R$100.001 até R$500.000">R$100.001 até R$500.000</option>
              <option value="R$500.001+">R$500.001+</option>
            </select>
          </div>
        </div>

        <h3 className="section-title">Dados para Pagamento</h3>
        <div className="form-section">
          <div className="form-group">
            <label>Chave Pix *</label>
            <input type="text" name="chavePix" value={formData.chavePix} onChange={handleChange} required />
            <small>Atenção: o titular da conta bancária deve ser o mesmo do cadastro no site.</small>
          </div>
        </div>

        <h3 className="section-title">Endereço</h3>
        <div className="form-section grid-2-cols">
          <div className="form-group">
            <label>CEP *</label>
            <input type="text" name="cep" value={formData.cep} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Bairro *</label>
            <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Rua *</label>
            <input type="text" name="rua" value={formData.rua} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Número *</label>
            <input type="text" name="numero" value={formData.numero} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Complemento</label>
            <input type="text" name="complemento" value={formData.complemento} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Cidade *</label>
            <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Estado *</label>
            <input type="text" name="estado" value={formData.estado} onChange={handleChange} required />
          </div>
        </div>

        <button className="cadastro-button" type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default Organizadores;
