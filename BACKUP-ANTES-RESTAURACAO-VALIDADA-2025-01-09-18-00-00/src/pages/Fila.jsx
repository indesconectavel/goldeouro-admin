// src/pages/Fila.jsx

import { useEffect, useState } from 'react';
import { postData } from '../js/api';

export default function Fila() {
  const [dadosFila, setDadosFila] = useState(null);
  const [userId] = useState(1); // Substitua por lógica real com autenticação futuramente

  useEffect(() => {
    async function fetchFila() {
      try {
        const result = await postData('/fila/status', { userId });
        setDadosFila(result);
      } catch (error) {
        console.error('Erro ao buscar status da fila:', error);
        setDadosFila(null);
      }
    }
    fetchFila();
  }, [userId]);

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
