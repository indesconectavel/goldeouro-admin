// src/pages/Fila.jsx

import { useEffect, useState } from 'react';
import { getData } from '../js/api';

export default function Fila() {
  const [dadosFila, setDadosFila] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dados fictícios para fallback
  const dadosFicticios = {
    position: 3,
    estimatedWait: 15,
    totalInQueue: 8,
    status: 'Aguardando',
    jaChutou: false,
    marcouGol: false,
    totalNaFila: 8
  };

  useEffect(() => {
    async function fetchFila() {
      try {
        setLoading(true);
        setError(null);
        const result = await getData('/fila');
        setDadosFila(result);
      } catch (error) {
        console.error('Erro ao buscar status da fila, usando dados fictícios:', error);
        setDadosFila(dadosFicticios);
      } finally {
        setLoading(false);
      }
    }
    fetchFila();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#000717] text-white min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">Fila de Chute</h1>
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg">Carregando status da fila...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#000717] text-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">Fila de Chute</h1>
          <p className="text-gray-400 text-lg">Status atual da fila de jogadores aguardando para jogar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Sua Posição</p>
                <p className="text-3xl font-bold text-yellow-400">{dadosFila?.position || 0}</p>
              </div>
              <div className="text-yellow-400 text-3xl">🎯</div>
            </div>
          </div>

          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Tempo Estimado</p>
                <p className="text-3xl font-bold text-blue-400">{dadosFila?.estimatedWait || 0} min</p>
              </div>
              <div className="text-blue-400 text-3xl">⏱️</div>
            </div>
          </div>

          <div className="bg-[#111827] p-6 rounded-lg border border-[#2c3e50]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total na Fila</p>
                <p className="text-3xl font-bold text-green-400">{dadosFila?.totalInQueue || 0}</p>
              </div>
              <div className="text-green-400 text-3xl">👥</div>
            </div>
          </div>
        </div>

        <div className="bg-[#111827] rounded-lg border border-[#2c3e50] p-6">
          <h2 className="text-2xl font-bold text-yellow-400 mb-6">Status Detalhado</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-[#2c3e50]">
                <span className="text-gray-400">Status da Partida:</span>
                <span className="text-white font-semibold">{dadosFila?.status || 'Aguardando'}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-[#2c3e50]">
                <span className="text-gray-400">Já Chutou:</span>
                <span className={`font-semibold ${dadosFila?.jaChutou ? 'text-green-400' : 'text-red-400'}`}>
                  {dadosFila?.jaChutou ? 'Sim' : 'Não'}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-[#2c3e50]">
                <span className="text-gray-400">Marcou Gol:</span>
                <span className={`font-semibold ${dadosFila?.marcouGol ? 'text-green-400' : 'text-red-400'}`}>
                  {dadosFila?.marcouGol ? 'Sim' : 'Não'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-[#2c3e50]">
                <span className="text-gray-400">Total de Jogadores:</span>
                <span className="text-white font-semibold">{dadosFila?.totalNaFila || 0}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-[#2c3e50]">
                <span className="text-gray-400">Próximo Jogo:</span>
                <span className="text-white font-semibold">Em breve</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-[#2c3e50]">
                <span className="text-gray-400">Última Atualização:</span>
                <span className="text-white font-semibold">{new Date().toLocaleTimeString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>

        {(!dadosFila || Object.keys(dadosFila).length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Ainda não há dados sobre a fila para exibir</p>
          </div>
        )}
      </div>
    </div>
  );
}
