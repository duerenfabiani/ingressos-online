import React, { useState, useEffect } from 'react';
import '../../../../styles/IngressosEventos.css';
import { FaSearch } from 'react-icons/fa';
import { NumericFormat } from 'react-number-format';
import { useParams } from 'react-router-dom';

export default function IngressosEventos() {
  const { id: eventoId } = useParams(); // Pega o ID do evento da URL

  const [pesquisa, setPesquisa] = useState('');
  const [ordenarPor, setOrdenarPor] = useState('data');
  const [modalAberto, setModalAberto] = useState(false);
  const [ingressos, setIngressos] = useState([]);

  const ingressoInicial = {
    titulo: '',
    preco: '',
    quantidade: '',
    ocultar: false,
    sem_taxa: false,
    descricao: '',
    inicio_vendas: '',
    fim_vendas: '',
    limite_checkin: '',
    min_por_pedido: '1',
    max_por_pedido: '1',
    max_por_cpf: '1',
    proximo_lote: '',
    evento_id: eventoId || ''
  };

  const [novoIngresso, setNovoIngresso] = useState(ingressoInicial);

  useEffect(() => {
    if (eventoId) {
      fetch(`http://localhost:4000/api/ingressos?evento_id=${eventoId}`)
        .then(res => res.json())
        .then(data => setIngressos(data))
        .catch(err => console.error('Erro ao carregar ingressos:', err));
    }
  }, [eventoId]);

  const toggleAtivo = (id) => {
    console.log('Alternar status do ingresso ID:', id);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNovoIngresso(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    try {
      const ingressoComEvento = { ...novoIngresso, evento_id: eventoId };

      const res = await fetch('http://localhost:4000/api/ingressos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ingressoComEvento)
      });

      if (!res.ok) throw new Error('Erro ao salvar ingresso');
      alert('Ingresso criado com sucesso!');
      setModalAberto(false);
      setNovoIngresso(ingressoInicial);

      // Atualiza a lista
      const updated = await fetch(`http://localhost:4000/api/ingressos?evento_id=${eventoId}`);
      const data = await updated.json();
      setIngressos(data);

    } catch (error) {
      console.error(error);
      alert('Erro ao criar ingresso');
    }
  };

  return (
    <div className="pagina-ingressos">
      <div className="cabecalho-ingressos">
        <button onClick={() => setModalAberto(true)}>Criar Ingresso</button>

        <div className="campo-pesquisa">
          <input
            type="text"
            placeholder="Pesquisar ingressos"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
          />
          <FaSearch className="icone-lupa" />
        </div>

        <select value={ordenarPor} onChange={(e) => setOrdenarPor(e.target.value)}>
          <option value="data">Data de criação</option>
          <option value="titulo">Título do ingresso</option>
          <option value="vendidos">Quantidade Vendida</option>
          <option value="receita">Volume de vendas</option>
        </select>
      </div>

      <div className="lista-ingressos">
        {ingressos
          .filter((ingresso) =>
            ingresso.titulo.toLowerCase().includes(pesquisa.toLowerCase())
          )
          .map((ingresso) => (
            <div className="card-ingresso" key={ingresso.id}>
              <div className="card-top">
                <div className="titulo-ingresso">
                  <i className="fas fa-ticket-alt"></i> {ingresso.titulo}
                </div>
                <div className="valor-ingresso">R$ {ingresso.preco}</div>
              </div>

              <div className="card-metricas">
                <div className="metrica">
                  <h4>{ingresso.vendidos}</h4>
                  <span>Vendido</span>
                </div>
                <div className="metrica">
                  <h4>{ingresso.disponiveis}</h4>
                  <span>Restante</span>
                </div>
                <div className="metrica">
                  <h4>{ingresso.reservados}</h4>
                  <span>Reservado</span>
                </div>
              </div>

              <div className="card-receita">
                <h4>R$ {ingresso.receita}</h4>
                <span>Receita</span>
              </div>

              <div className="card-acao">
                <button onClick={() => toggleAtivo(ingresso.id)}>
                  {ingresso.ativo ? 'Pausar' : 'À venda'}
                </button>
              </div>
            </div>
          ))}
      </div>

      {modalAberto && (
        <div className="modal-ingresso">
          <div className="modal-conteudo">
            <h2>Criar Ingresso</h2>

            <label>Título do ingresso:</label>
            <input type="text" name="titulo" value={novoIngresso.titulo} onChange={handleInputChange} />

            <label>Preço do Ingresso:</label>
            <NumericFormat
              name="preco"
              value={novoIngresso.preco}
              onValueChange={(values) =>
                handleInputChange({ target: { name: 'preco', value: values.floatValue || 0 } })
              }
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              className="input-mascara"
            />

            <label>Quantidade disponível:</label>
            <input
              type="number"
              name="quantidade"
              min="1"
              step="1"
              value={novoIngresso.quantidade}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (['.', ',', 'e', '-', '+'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />

            <label>
              <input type="checkbox" name="ocultar" checked={novoIngresso.ocultar} onChange={handleInputChange} />
              Ocultar este ingresso
            </label>

            <label>
              <input type="checkbox" name="sem_taxa" checked={novoIngresso.sem_taxa} onChange={handleInputChange} />
              Não cobrar taxa sobre este ingresso
            </label>

            <label>Descrição do ingresso:</label>
            <textarea name="descricao" value={novoIngresso.descricao} onChange={handleInputChange}></textarea>

            <label>Começar a venda:</label>
            <input type="datetime-local" name="inicio_vendas" value={novoIngresso.inicio_vendas || ''} onChange={handleInputChange} />

            <label>Fim das vendas:</label>
            <input type="datetime-local" name="fim_vendas" value={novoIngresso.fim_vendas || ''} onChange={handleInputChange} />

            <label>Horário limite para check-in:</label>
            <input type="datetime-local" name="limite_checkin" value={novoIngresso.limite_checkin || ''} onChange={handleInputChange} />

            <label>Ingressos mínimos por pedido:</label>
            <select name="min_por_pedido" value={novoIngresso.min_por_pedido} onChange={handleInputChange}>
              {[...Array(15)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>

            <label>Ingressos máximos por pedido:</label>
            <select name="max_por_pedido" value={novoIngresso.max_por_pedido} onChange={handleInputChange}>
              {[...Array(15)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>

            <label>Máximo de ingressos por CPF:</label>
            <select name="max_por_cpf" value={novoIngresso.max_por_cpf} onChange={handleInputChange}>
              <option value="">Sem limite</option>
              {[...Array(15)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>

            <label>Próximo lote de ingressos:</label>
            <input type="text" name="proximo_lote" value={novoIngresso.proximo_lote} onChange={handleInputChange} />

            <div className="modal-botoes">
              <button onClick={() => { setModalAberto(false); setNovoIngresso(ingressoInicial); }}>
                Cancelar
              </button>
              <button onClick={handleSubmit}>Criar Ingresso</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
