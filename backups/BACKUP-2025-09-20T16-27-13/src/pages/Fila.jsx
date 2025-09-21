import { useEffect, useState } from 'react';
import { postData } from '../js/api';
import CardTemplate from '../templates/CardTemplate';
import GridTemplate from '../templates/GridTemplate';

export default function Fila() {
  const [dadosFila, setDadosFila] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId] = useState(1); // Substitua por lógica real com autenticação futuramente

  useEffect(() => {
    async function fetchFila() {
      try {
        const result = await postData('/fila/status', { userId });
        setDadosFila(result);
      } catch (error) {
        console.error('Erro ao buscar status da fila:', error);
        // Dados fictícios como fallback
        setDadosFila({
          posicao: 3,
          status: 'aguardando',
          jaChutou: false,
          marcouGol: false,
          totalNaFila: 15,
          tempoEstimado: '5 minutos'
        });
      } finally {
        setLoading(false);
      }
    }
    fetchFila();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-yellow-400">Carregando status da fila...</div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-semibold";
    switch (status) {
      case 'aguardando':
        return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-400`}>Aguardando</span>;
      case 'jogando':
        return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>Jogando</span>;
      case 'finalizado':
        return <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>Finalizado</span>;
      default:
        return <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>Desconhecido</span>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">Fila de Chute</h1>
      <p className="text-gray-300 mb-6">
        Status atual na fila de chute.
      </p>

      {!dadosFila || Object.keys(dadosFila).length === 0 ? (
        <div className="space-y-6">
          <div className="text-center text-gray-400">Ainda não possui dados sobre a fila para exibir.</div>
        </div>
      ) : (
        <>
          {/* Cards de Status */}
          <GridTemplate cols={{ sm: 2, lg: 4 }}>
            <CardTemplate 
              title="Posição Atual" 
              value={`#${dadosFila.posicao}`} 
              color="yellow" 
            />
            <CardTemplate 
              title="Status da Partida" 
              value={getStatusBadge(dadosFila.status)} 
              color="blue" 
            />
            <CardTemplate 
              title="Total na Fila" 
              value={dadosFila.totalNaFila} 
              color="red" 
            />
            <CardTemplate 
              title="Tempo Estimado" 
              value={dadosFila.tempoEstimado || 'N/A'} 
              color="green" 
            />
          </GridTemplate>

          {/* Informações Detalhadas */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-yellow-400 mb-4">Informações Detalhadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Já chutou:</span>
                  <span className="text-white font-semibold">
                    {dadosFila.jaChutou ? 'Sim' : 'Não'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Marcou gol:</span>
                  <span className="text-white font-semibold">
                    {dadosFila.marcouGol ? 'Sim' : 'Não'}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Status:</span>
                  {getStatusBadge(dadosFila.status)}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Posição:</span>
                  <span className="text-white font-semibold">
                    {dadosFila.posicao} de {dadosFila.totalNaFila}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}