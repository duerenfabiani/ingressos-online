import React, { useEffect, useState } from 'react';
import '../../../../styles/PainelEvento.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

export default function PainelEvento({ eventoId }) {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/eventos/${eventoId}/dashboard`)
      .then(res => res.json())
      .then(setDados)
      .catch(err => console.error('Erro ao carregar dados do dashboard', err));
  }, [eventoId]);

  const formatarValor = (v) => {
    const n = Number(v);
    return isNaN(n) ? '0.00' : n.toFixed(2);
  };

  const gerarBaseZerada = () => {
    const hoje = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(hoje);
      d.setDate(d.getDate() - i * 3);
      return {
        data: d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        total: 0
      };
    }).reverse();
  };

  if (!dados) return <p>Carregando...</p>;

  return (
    <div className="painel-evento">
      <div className="painel-valores">
        <div className="box"><h4>Receita</h4><p>R$ {formatarValor(dados.metricas?.receita)}</p></div>
        <div className="box"><h4>Ingressos Vendidos</h4><p>{dados.metricas?.vendidos}</p></div>
        <div className="box"><h4>Ingressos Reservados</h4><p>{dados.metricas?.reservados}</p></div>
        <div className="box"><h4>Visualizações</h4><p>{dados.metricas?.visualizacoes}</p></div>
      </div>

      <div className="graficos-grid">
        <div className="grafico-box">
          <h4>Ingressos Vendidos</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dados.vendidosHistorico?.length ? dados.vendidosHistorico : gerarBaseZerada()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grafico-box">
          <h4>Volume de Vendas de Ingressos</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dados.valoresHistorico?.length ? dados.valoresHistorico : gerarBaseZerada()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#ffc658" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grafico-box">
          <h4>Exibições da Página do Evento</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dados.visualizacoesHistorico?.length ? dados.visualizacoesHistorico : gerarBaseZerada()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bordero">
        <h3>Borderô</h3>
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Valor Unit.</th>
              <th>Vendidos</th>
              <th>Estoque</th>
              <th>Reservados</th>
              <th>Valor Total</th>
              <th>Check-ins</th>
            </tr>
          </thead>
          <tbody>
            {dados.bordero?.map((item, idx) => (
              <tr key={idx}>
                <td>{item.descricao}</td>
                <td>R$ {formatarValor(item.valor_unit)}</td>
                <td>{item.vendidos}</td>
                <td>{item.quantidade}</td>
                <td>{item.reservados}</td>
                <td>R$ {formatarValor(item.valor_total)}</td>
                <td>{item.checkins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
