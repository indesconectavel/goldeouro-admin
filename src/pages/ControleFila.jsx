// src/pages/ControleFila.jsx

import { useEffect, useState } from 'react';
import { postData } from '../js/api';
import Loader from '../components/Loader';

export default function ControleFila() {
  const [filaInfo, setFilaInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFila() {
      try {
        const response = await postData('/admin/controle-fila', {});
        setFilaInfo(response);
      } catch (error) {
        console.error('Erro ao buscar controle da fila:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFila();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      <div className="bg-card p-8 rounded shadow-md max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
          Controle Geral da Fila
        </h1>

        {!filaInfo || Object.keys(filaInfo).length === 0 ? (
          <p className="text-muted-foreground text-center mt-20">
            Ainda não possui dados sobre a fila para exibir.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-[#111827] p-4 rounded shadow text-center">
                <p className="text-sm text-gray-300">Jogadores aguardando</p>
                <h2 className="text-xl font-bold text-yellow-400">
                  {filaInfo.totalNaFila ?? 0}
                </h2>
              </div>
              <div className="bg-[#111827] p-4 rounded shadow text-center">
                <p className="text-sm text-gray-300">Tabuleiro Atual</p>
                <h2 className="text-xl font-bold text-white">
                  #{filaInfo.idTabuleiroAtual ?? 'N/D'}
                </h2>
              </div>
              <div className="bg-[#111827] p-4 rounded shadow text-center">
                <p className="text-sm text-gray-300">Status</p>
                <h2 className="text-xl font-bold text-green-400 capitalize">
                  {filaInfo.statusFila ?? 'inativo'}
                </h2>
              </div>
              <div className="bg-[#111827] p-4 rounded shadow text-center">
                <p className="text-sm text-gray-300">Última Atualização</p>
                <h2 className="text-sm font-semibold text-gray-200">
                  {filaInfo.updatedAt
                    ? new Date(filaInfo.updatedAt).toLocaleString('pt-BR')
                    : '---'}
                </h2>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-yellow-300 mb-3">
              Jogadores no Tabuleiro Atual:
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border border-border rounded-lg shadow-sm text-sm">
                <thead className="bg-[#111827] text-yellow-300 uppercase">
                  <tr>
                    <th className="px-4 py-2 border">#</th>
                    <th className="px-4 py-2 border">ID Usuário</th>
                    <th className="px-4 py-2 border">Nome</th>
                    <th className="px-4 py-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filaInfo.jogadores?.map((jogador, index) => (
                    <tr key={jogador.id} className="text-center hover:bg-muted/20">
                      <td className="px-4 py-2 border">{index + 1}</td>
                      <td className="px-4 py-2 border">{jogador.id}</td>
                      <td className="px-4 py-2 border">{jogador.name || '---'}</td>
                      <td className="px-4 py-2 border capitalize">
                        {jogador.status || 'aguardando'}
                      </td>
                    </tr>
                  ))}
                  {filaInfo.jogadores?.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-4 py-6 text-center text-muted-foreground">
                        Nenhum jogador no tabuleiro atual.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
