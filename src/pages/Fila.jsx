// src/pages/Fila.jsx

import { useEffect, useState } from 'react';
import { postData } from '../js/api';

export default function Fila() {
  const [dadosFila, setDadosFila] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId] = useState(1); // Substitua por lógica real com autenticação futuramente

  useEffect(() => {
    async function fetchFila() {
      try {
        setLoading(true);
        setError(null);
        const result = await postData('/fila/status', { userId });
        setDadosFila(result);
      } catch (error) {
        console.error('Erro ao buscar status da fila:', error);
        setError('Não foi possível carregar o status da fila. Tente novamente mais tarde.');
        setDadosFila(null);
      } finally {
        setLoading(false);
      }
    }
    fetchFila();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-background text-foreground min-h-screen p-6">
        <div className="bg-card p-8 rounded shadow-md max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-yellow-400 mb-4">Fila de Chute</h1>
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-2"></div>
            <p className="text-gray-400">Carregando status da fila...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background text-foreground min-h-screen p-6">
        <div className="bg-card p-8 rounded shadow-md max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-yellow-400 mb-4">Fila de Chute</h1>
          <div className="text-center p-8">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      <div className="bg-card p-8 rounded shadow-md max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-yellow-400 mb-4">Fila de Chute</h1>

        {!dadosFila || Object.keys(dadosFila).length === 0 ? (
          <p className="text-muted-foreground text-center mt-20">
            Ainda não possui dados sobre a fila para exibir.
          </p>
        ) : (
          <ul className="space-y-3 text-sm sm:text-base text-white">
            <li><strong>Posição atual:</strong> {dadosFila.posicao}</li>
            <li><strong>Status da partida:</strong> {dadosFila.status}</li>
            <li><strong>Já chutou:</strong> {dadosFila.jaChutou ? 'Sim' : 'Não'}</li>
            <li><strong>Marcou gol:</strong> {dadosFila.marcouGol ? 'Sim' : 'Não'}</li>
            <li><strong>Total de jogadores aguardando:</strong> {dadosFila.totalNaFila}</li>
          </ul>
        )}
      </div>
    </div>
  );
}
