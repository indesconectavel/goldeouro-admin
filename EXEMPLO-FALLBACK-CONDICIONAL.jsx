// EXEMPLO DE IMPLEMENTAÇÃO DE FALLBACK CONDICIONAL
// Este arquivo mostra como implementar proteção em qualquer página
// Data: 21/09/2025

import React, { useEffect, useState } from 'react';
import { getEnvironment, safeDataFetch, shouldFallbackToMock, log } from '../src/config/environment';
import api from '../services/api';

// Dados fictícios para fallback
const mockData = {
  usuarios: [
    { id: 1, nome: 'João Silva', email: 'joao@exemplo.com', status: 'ativo' },
    { id: 2, nome: 'Maria Santos', email: 'maria@exemplo.com', status: 'inativo' }
  ],
  total: 2,
  ativos: 1,
  inativos: 1
};

export default function ExemploProtegido() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Usar função segura de fetch
        const result = await safeDataFetch(
          () => api.get('/usuarios'), // Chamada da API
          mockData, // Dados fictícios para fallback
          shouldFallbackToMock() // Se deve usar fallback
        );

        setDados(result);
        log('info', 'Dados carregados com sucesso');

      } catch (error) {
        log('error', 'Erro ao carregar dados', error);
        setError('Erro ao carregar dados');
        
        // Em produção, não usar dados fictícios
        if (getEnvironment().USE_MOCK_DATA) {
          setDados(mockData);
          log('warn', 'Usando dados fictícios como fallback');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Renderização condicional baseada no ambiente
  if (loading) {
    return (
      <div className="text-center text-yellow-400">
        Carregando dados...
      </div>
    );
  }

  if (error && !dados) {
    return (
      <div className="text-center text-red-400">
        {error}
        {getEnvironment().SHOW_DEBUG_INFO && (
          <div className="mt-2 text-sm text-gray-400">
            Ambiente: {getEnvironment().API_URL}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h2>Usuários</h2>
      
      {/* Indicador de ambiente (apenas em desenvolvimento) */}
      {getEnvironment().SHOW_DEBUG_INFO && (
        <div className="mb-4 p-2 bg-blue-500/20 border border-blue-500/30 rounded">
          <div className="text-sm text-blue-300">
            🔧 Modo: {getEnvironment().API_URL.includes('localhost') ? 'Desenvolvimento' : 'Produção'}
          </div>
          <div className="text-sm text-blue-300">
            📊 Dados: {dados === mockData ? 'Fictícios' : 'Reais'}
          </div>
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <h3 className="text-lg font-bold text-yellow-400">Total</h3>
          <p className="text-2xl font-bold text-white">{dados?.total || 0}</p>
        </div>
        <div className="card p-4">
          <h3 className="text-lg font-bold text-green-400">Ativos</h3>
          <p className="text-2xl font-bold text-white">{dados?.ativos || 0}</p>
        </div>
        <div className="card p-4">
          <h3 className="text-lg font-bold text-red-400">Inativos</h3>
          <p className="text-2xl font-bold text-white">{dados?.inativos || 0}</p>
        </div>
      </div>

      {/* Lista de usuários */}
      <div className="card">
        <h3 className="text-lg font-bold text-white mb-4">Lista de Usuários</h3>
        <div className="space-y-2">
          {dados?.usuarios?.map(usuario => (
            <div key={usuario.id} className="flex justify-between items-center p-2 bg-white/5 rounded">
              <div>
                <span className="text-white font-medium">{usuario.nome}</span>
                <span className="text-gray-400 ml-2">({usuario.email})</span>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                usuario.status === 'ativo' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {usuario.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// INSTRUÇÕES DE IMPLEMENTAÇÃO:
// 1. Importar as funções de ambiente
// 2. Usar safeDataFetch para chamadas de API
// 3. Implementar fallback condicional
// 4. Adicionar indicadores visuais de ambiente
// 5. Manter dados fictícios como fallback
// 6. Usar logging condicional
