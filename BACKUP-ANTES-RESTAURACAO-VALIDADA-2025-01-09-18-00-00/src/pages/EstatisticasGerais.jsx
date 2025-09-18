// src/pages/EstatisticasGerais.jsx

import { useEffect, useState } from 'react';
import { postData } from '../js/api';
import Loader from '../components/Loader';

export default function EstatisticasGerais() {
  const [estatisticas, setEstatisticas] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await postData('/admin/estatisticas-gerais', {});
        setEstatisticas(result);
      } catch (error) {
        console.error('Erro ao carregar estatísticas gerais:', error);
        setEstatisticas(null);
      }
    }
    fetchData();
  }, []);

  if (!estatisticas) return <Loader />;

  const {
    totalUsuarios,
    usuariosAtivos,
    usuariosBloqueados,
    totalPartidas,
    mediaGolsPorPartida
  } = estatisticas;

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      <div className="bg-card p-6 rounded shadow-md max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6">Estatísticas Gerais</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm sm:text-base">
          <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
            <p className="text-gray-300">Total de Usuários</p>
            <h2 className="text-xl font-bold text-white">{totalUsuarios}</h2>
          </div>
          <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
            <p className="text-gray-300">Usuários Ativos</p>
            <h2 className="text-xl font-bold text-green-400">{usuariosAtivos}</h2>
          </div>
          <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
            <p className="text-gray-300">Usuários Bloqueados</p>
            <h2 className="text-xl font-bold text-red-400">{usuariosBloqueados}</h2>
          </div>
          <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center">
            <p className="text-gray-300">Partidas Finalizadas</p>
            <h2 className="text-xl font-bold text-white">{totalPartidas}</h2>
          </div>
          <div className="bg-[#1f2937] p-4 rounded-lg shadow text-center sm:col-span-2">
            <p className="text-gray-300">Média de Gols por Partida</p>
            <h2 className="text-xl font-bold text-yellow-400">{mediaGolsPorPartida}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
