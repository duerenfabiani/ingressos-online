import React, { useEffect, useState } from 'react';
import '../../../../styles/PedidosEventos.css';

export default function PedidosEventos() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const organizadorId = usuario?.id || null;

  useEffect(() => {
    if (!organizadorId) return;

    const fetchPedidos = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/pedidos?organizador_id=${organizadorId}`);
        if (!res.ok) throw new Error('Erro ao buscar pedidos');
        const data = await res.json();
        setPedidos(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPedidos();
  }, [organizadorId]);

  const abrirModal = (pedido) => {
    setPedidoSelecionado(pedido);
    setMostrarModal(true);
  };

  const fecharModal = () => {
    setMostrarModal(false);
    setPedidoSelecionado(null);
  };

  const formatarValor = (valor) => {
    const n = Number(valor);
    return isNaN(n) ? '0.00' : n.toFixed(2);
  };

  return (
    <div className="pedidos-container">
      <h2>Pedidos</h2>
      <table className="tabela-pedidos">
        <thead>
          <tr>
            <th>Referência</th>
            <th>Data do Pedido</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Valor</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.length === 0 ? (
            <tr><td colSpan="7">Nenhum pedido encontrado.</td></tr>
          ) : (
            pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{new Date(pedido.data_pedido).toLocaleString()}</td>
                <td>{pedido.comprador_nome}</td>
                <td>{pedido.comprador_email}</td>
                <td>R$ {formatarValor(pedido.valor_total)}</td>
                <td>{pedido.status_pagamento}</td>
                <td>
                  <button onClick={() => abrirModal(pedido)}>Detalhes</button>
                  <button className="cancelar">Cancelar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {mostrarModal && pedidoSelecionado && (
        <div className="modal-overlay">
          <div className="modal-detalhes">
            <h3>Visão Geral do Pedido</h3>
            <div className="colunas">
              <div>
                <p><strong>Nome:</strong> {pedidoSelecionado.comprador_nome}</p>
                <p><strong>Valor:</strong> R$ {formatarValor(pedidoSelecionado.valor_total)}</p>
                <p><strong>Data:</strong> {new Date(pedidoSelecionado.data_pedido).toLocaleString()}</p>
              </div>
              <div>
                <p><strong>CPF:</strong> {pedidoSelecionado.cpf || '—'}</p>
                <p><strong>Referência:</strong> {pedidoSelecionado.id}</p>
                <p><strong>Email:</strong> {pedidoSelecionado.comprador_email}</p>
                <p><strong>Celular:</strong> {pedidoSelecionado.celular || '—'}</p>
              </div>
            </div>

            <h4>Ingressos do Pedido</h4>
            <table className="subtabela">
              <thead>
                <tr>
                  <th>Ingresso</th>
                  <th>Quantidade</th>
                  <th>Preço</th>
                  <th>Taxa de Serviço</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {pedidoSelecionado.itens?.map((item, i) => (
                  <tr key={i}>
                    <td>{item.titulo}</td>
                    <td>{item.quantidade}</td>
                    <td>R$ {formatarValor(item.preco_unitario)}</td>
                    <td>R$ {formatarValor(item.taxa_servico || 0)}</td>
                    <td>R$ {formatarValor(item.quantidade * item.preco_unitario + (item.taxa_servico || 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4>Participantes</h4>
            <table className="subtabela">
              <thead>
                <tr>
                  <th>Participante</th>
                  <th>Email</th>
                  <th>Ingresso</th>
                  <th>Último check-in</th>
                </tr>
              </thead>
              <tbody>
                {pedidoSelecionado.participantes?.map((part, i) => (
                  <tr key={i}>
                    <td>{part.nome}</td>
                    <td>{part.email}</td>
                    <td>{part.ingresso}</td>
                    <td>{part.checkin ? new Date(part.checkin).toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="modal-botoes">
              <button className="editar">Editar</button>
              <button className="fechar" onClick={fecharModal}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
