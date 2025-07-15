import React, { useState } from 'react';
import '../styles/ClienteCadastro.css';
import { Link } from 'react-router-dom';

export default function ClienteCadastro() {
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    nascimento: '',
    genero: '',
    email: '',
    confirmarEmail: '',
    cpf: '',
    celular: '',
    cep: '',
    bairro: '',
    rua: '',
    numero: '',
    complemento: '',
    cidade: '',
    estado: '',
    aceitaTermos: false,
    desejaNovidades: true
  });

  const estadosBrasil = [
    '', 'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.email !== formData.confirmarEmail) {
      alert('Os e-mails não coincidem.');
      return;
    }

    if (!formData.aceitaTermos) {
      alert('Você precisa aceitar os Termos do Contrato.');
      return;
    }

    console.log('Dados enviados:', formData);
    // Enviar para o backend com fetch/axios etc
  };

  return (
    <div className="cliente-cadastro-container">
      <h2>Crie sua Conta</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Nome</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Sobrenome</label>
            <input type="text" name="sobrenome" value={formData.sobrenome} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Data de Nascimento</label>
            <input type="date" name="nascimento" value={formData.nascimento} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Gênero</label>
            <select name="genero" value={formData.genero} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
              <option value="Prefiro não dizer">Prefiro não dizer</option>
            </select>
          </div>
          <div className="form-group">
            <label>E-mail</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Confirme seu E-mail</label>
            <input type="email" name="confirmarEmail" value={formData.confirmarEmail} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>CPF</label>
            <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Celular</label>
            <input type="text" name="celular" value={formData.celular} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>CEP</label>
            <input type="text" name="cep" value={formData.cep} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Bairro</label>
            <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Rua</label>
            <input type="text" name="rua" value={formData.rua} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Número</label>
            <input type="text" name="numero" value={formData.numero} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Complemento</label>
            <input type="text" name="complemento" value={formData.complemento} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Cidade</label>
            <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Estado</label>
            <select name="estado" value={formData.estado} onChange={handleChange} required>
              {estadosBrasil.map((estado) => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="aceitaTermos"
              checked={formData.aceitaTermos}
              onChange={handleChange}
              required
            />
            Declaro que li e aceito integralmente os{' '}
            <Link to="/termos" target="_blank" rel="noopener noreferrer">
              Termos do Contrato</Link>.
          </label>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="desejaNovidades"
              checked={formData.desejaNovidades}
              onChange={handleChange}
            />
            Desejo receber novidades e promoções por e-mail.
          </label>
        </div>

        <button type="submit" className="submit-button">Criar Conta</button>
        <p className="login-link">
          Já tem uma conta? <Link to="/cliente/login">Faça login</Link>
        </p>
      </form>
    </div>
  );
}
