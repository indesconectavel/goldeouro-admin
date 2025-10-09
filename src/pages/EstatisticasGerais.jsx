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
        // DADOS ZERADOS PARA PRODUÇÃO
        setEstatisticas({
          totalUsuarios: 0,
          usuariosAtivos: 0,
          usuariosBloqueados: 0,
          totalPartidas: 0,
          mediaGolsPorPartida: 0
        });
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Estatísticas Gerais</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm sm:text-base">
        <div className="card p-4 text-center">
          <p className="text-gray-300">Total de Usuários</p>
          <h2 className="text-xl font-bold text-white">{totalUsuarios}</h2>
        </div>
        <div className="card p-4 text-center">
          <p className="text-gray-300">Usuários Ativos</p>
          <h2 className="text-xl font-bold text-green-400">{usuariosAtivos}</h2>
        </div>
        <div className="card p-4 text-center">
          <p className="text-gray-300">Usuários Bloqueados</p>
          <h2 className="text-xl font-bold text-red-400">{usuariosBloqueados}</h2>
        </div>
        <div className="card p-4 text-center">
          <p className="text-gray-300">Partidas Finalizadas</p>
          <h2 className="text-xl font-bold text-white">{totalPartidas}</h2>
        </div>
        <div className="card p-4 text-center sm:col-span-2">
          <p className="text-gray-300">Média de Gols por Partida</p>
          <h2 className="text-xl font-bold text-yellow-400">{mediaGolsPorPartida}</h2>
        </div>
      </div>
    </div>
  );
}
