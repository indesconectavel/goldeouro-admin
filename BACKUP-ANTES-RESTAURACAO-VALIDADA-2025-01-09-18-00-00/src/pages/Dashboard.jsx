import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const [resumo, setResumo] = useState(null);

  useEffect(() => {
    async function fetchResumo() {
      try {
        const response = await api.post('/admin/relatorio-semanal', {});
        setResumo(response.data);
      } catch (error) {
        console.error('Erro ao buscar resumo:', error);
      }
    }
    fetchResumo();
  }, []);

  if (!resumo) return <Loader />;

  const dadosGrafico = [
    { name: 'Entradas', valor: resumo.credits },
    { name: 'Saques', valor: resumo.debits },
    { name: 'Lucro', valor: resumo.balance },
  ];

  const formatCurrency = (valor) =>
    valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const formatData = (dataStr) => {
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-[#000717] p-8 rounded shadow-md max-w-6xl mx-auto mt-10 text-white">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Painel de Controle</h1>

      <p className="text-sm text-center text-gray-400 mb-8">
        Período: <span className="text-white font-semibold">
          {formatData(resumo.period.from)} até {formatData(resumo.period.to)}
        </span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
        <div className="bg-[#111827] p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-300">Entradas (Créditos)</p>
          <h2 className="text-xl font-bold text-green-400">{formatCurrency(resumo.credits)}</h2>
        </div>
        <div className="bg-[#111827] p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-300">Saques (Débitos)</p>
          <h2 className="text-xl font-bold text-red-400">{formatCurrency(resumo.debits)}</h2>
        </div>
        <div className="bg-[#111827] p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-300">Lucro</p>
          <h2 className="text-xl font-bold text-yellow-400">{formatCurrency(resumo.balance)}</h2>
        </div>
        <div className="bg-[#111827] p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-300">Partidas Finalizadas</p>
          <h2 className="text-xl font-bold text-white">{resumo.finished_games}</h2>
        </div>
      </div>

      <div className="bg-[#111827] p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-yellow-300 mb-4 text-center">Visualização Gráfica</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dadosGrafico}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: "#1f2937",
                borderColor: "#FFD700",
                color: "#fff"
              }}
            />
            <Bar dataKey="valor" fill="#FFD700" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
