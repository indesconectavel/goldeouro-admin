// TEMPLATE PADRÃO PARA PÁGINAS DO PAINEL DE CONTROLE
// Baseado nas páginas funcionais: /relatorio-financeiro e /estatisticas

import { useEffect, useState } from 'react';
import { postData } from '../js/api';
// import api from '../services/api'; // Alternativa com Axios

export default function PageTemplate({ 
  title, 
  description, 
  endpoint, 
  dataProcessor,
  children 
}) {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await postData(endpoint, {});
        setDados(dataProcessor ? dataProcessor(result) : result);
      } catch (error) {
        console.error(`Erro ao buscar dados de ${title}:`, error);
        // Dados fictícios como fallback
        setDados({
          // Dados mock específicos para cada página
          // Serão definidos em cada implementação
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [endpoint, dataProcessor, title]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-yellow-400">Carregando {title.toLowerCase()}...</div>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="space-y-6">
        <div className="text-center text-gray-400">Ainda não possui dados de {title.toLowerCase()}...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">{title}</h1>
      {description && (
        <p className="text-gray-300 mb-6">{description}</p>
      )}
      {children(dados)}
    </div>
  );
}
