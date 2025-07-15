import './CompraIngresso.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';  // Importando ícones

export default function CompraIngresso() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventoId = searchParams.get('evento_id');

  const [evento, setEvento] = useState(null);
  const [lotes, setLotes] = useState([]); // Inicializando como array
  const [quantidade, setQuantidade] = useState(1);
  const [erro, setErro] = useState('');

  // ✅ Carregar evento e lotes
  useEffect(() => {
    if (!eventoId) {
      setErro('Evento não especificado na URL.');
      return;
    }

    fetch(`http://localhost:4000/api/eventos/${eventoId}`)
      .then(res => res.json())
      .then(data => setEvento(data))
      .catch(() => setErro('Erro ao carregar evento.'));

    fetch(`http://localhost:4000/api/eventos/${eventoId}/lotes`)
      .then(res => res.json())
      .then(data => {
        // Garantir que lotes é um array
        if (Array.isArray(data)) {
          setLotes(data);
        } else {
          setLotes([]);  // Caso não seja um array, inicialize como array vazio
        }
      })
      .catch(() => setErro('Erro ao carregar lotes.'));
  }, [eventoId]);

  // ✅ Função de compra (salva carrinho e redireciona)
  function handleComprar() {
    const loteAtual = lotes.find(lote => lote.id === eventoId); // Encontre o lote com o id correto
    if (!loteAtual) {
      setErro('Nenhum lote disponível no momento.');
      return;
    }

    if (quantidade < 1) {
      setErro('Selecione uma quantidade válida.');
      return;
    }

    const compra = {
      evento_id: eventoId,
      lote_id: loteAtual.id,
      quantidade
    };

    localStorage.setItem('carrinho', JSON.stringify(compra));
    navigate(`/checkout?evento_id=${eventoId}`);
  }

  // ✅ Formatar data
  function formatarDataCompleta(dataISO) {
    if (!dataISO) return '';
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mes começa do 0
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  // ✅ Filtrar lote atual
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const lotesValidos = lotes.filter(l => {
    const inicio = new Date(l.data_inicio);
    const fim = new Date(l.data_fim);
    inicio.setHours(0, 0, 0, 0);
    fim.setHours(23, 59, 59, 999);
    const disponivel = l.quantidade_total - l.quantidade_vendida > 0;
    return hoje >= inicio && hoje <= fim && disponivel;
  });

  const loteAtual = lotesValidos[0];
  const valorUnitario = loteAtual ? Number(loteAtual.valor) : 0;
  const taxa = 10.00;
  const valorTotal = (valorUnitario + taxa) * quantidade;

  // ✅ Renderização
  if (erro) {
    return <div className="compra-container"><p className="erro">{erro}</p></div>;
  }

  if (!evento) {
    return <div className="compra-container"><p>⏳ Carregando dados do evento...</p></div>;
  }

  return (
    <div className="compra-container">
      <div className="evento-banner">
        <img 
          src={`http://localhost:4000${evento.banner_url}`} 
          alt={evento.nome} 
        />
      </div>

      <div className="evento-detalhes-container">
          <div className="evento-info">
            <h2>
              {evento.nome}
              <button className="classificacao-etaria-btn">
                18+
              </button>
            </h2> 
            <p className="evento-local">
              <FaMapMarkerAlt /> {evento.local || 'Local não informado'}
              </p>
            <p className="evento-data">
              <FaCalendarAlt /><span className="compra-header-title"> Data: </span> {formatarDataCompleta(evento.data_inicio)}
            </p>
            <div className="evento-descricao">
              <h3>Informações gerais</h3><br></br>
              {evento.descricao || 'Descrição não disponível.'}
            </div>
          </div>

        <div className="compra-box">
          <div className="compra-header">
            <span className="compra-header-title">Ingressos</span>
            <span className="compra-header-total">🛒 R$ {valorTotal.toFixed(2)}</span>
          </div>

          {loteAtual ? (
            <>
              <div className="compra-conteudo">
                <div className="compra-linha">
                  <span className="compra-lote-nome"><strong>{loteAtual.nome}</strong></span>
                  <div className="compra-quantidade">
                    <button onClick={() => setQuantidade(Math.max(1, quantidade - 1))}>–</button>
                    <span>{quantidade}</span>
                    <button onClick={() => setQuantidade(Math.min(5, quantidade + 1))}>+</button>
                  </div>
                </div>
                <div className="compra-validade">
                  Vendas até {formatarDataCompleta(loteAtual.data_fim)}
                </div>
              </div>

              <hr className="compra-divisor" />

              <div className="compra-total">
                Total: <strong>R$ {valorTotal.toFixed(2)}</strong>
              </div>

              <button className="compra-button" onClick={handleComprar}>
                COMPRAR INGRESSOS
              </button>
            </>
          ) : (
            <p className="erro">⚠️ Nenhum lote disponível para compra no momento.</p>
          )}
        </div>
      </div>
    </div>
  );
}
