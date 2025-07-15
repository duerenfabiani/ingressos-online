import React, { useState, useEffect } from 'react';
import './CadastroLote.css';

export default function CadastroLote() {
  const [eventos, setEventos] = useState([]);
  const [form, setForm] = useState({
    evento_id: '',
    nome: '',
    valor: '',
    quantidade_total: '',
    data_inicio: '',
    data_fim: ''
  });
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    // Carrega lista de eventos para o select
    fetch('http://localhost:4000/api/eventos')
      .then(res => res.json())
      .then(data => setEventos(data))
      .catch(() => setErro('Erro ao carregar eventos'));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setMensagem('');

    try {
      const res = await fetch('http://localhost:4000/api/lotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMensagem('Lote cadastrado com sucesso!');
        setForm({
          evento_id: '',
          nome: '',
          valor: '',
          quantidade_total: '',
          data_inicio: '',
          data_fim: ''
        });
      } else {
        setErro(data.erro || 'Erro ao cadastrar lote');
      }
    } catch (err) {
      setErro('Erro de conexão com o servidor');
    }
  }

  return (
    <div className="cadastro-lote-container">
      <h2>Cadastrar Novo Lote</h2>

      {erro && <div className="erro">{erro}</div>}
      {mensagem && <div className="sucesso">{mensagem}</div>}

      <form onSubmit={handleSubmit}>
        <label>Evento:</label>
        <select
          name="evento_id"
          value={form.evento_id}
          onChange={handleChange}
          required
        >
          <option value="">-- selecione --</option>
          {eventos.map(ev => (
            <option key={ev.id} value={ev.id}>{ev.nome}</option>
          ))}
        </select>

        <label>Nome do Lote:</label>
        <input
          type="text"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          required
        />

        <label>Valor (R$):</label>
        <input
          type="number"
          name="valor"
          value={form.valor}
          onChange={handleChange}
          required
          step="0.01"
        />

        <label>Quantidade Total:</label>
        <input
          type="number"
          name="quantidade_total"
          value={form.quantidade_total}
          onChange={handleChange}
          required
        />

        <label>Data de Início:</label>
        <input
          type="date"
          name="data_inicio"
          value={form.data_inicio}
          onChange={handleChange}
          required
        />

        <label>Data de Fim:</label>
        <input
          type="date"
          name="data_fim"
          value={form.data_fim}
          onChange={handleChange}
          required
        />

        <button type="submit">Cadastrar Lote</button>
      </form>
    </div>
  );
}
