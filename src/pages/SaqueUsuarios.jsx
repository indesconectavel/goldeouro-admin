import React, { useState, useEffect } from 'react';
import { postData } from '../js/api';

const SaqueUsuarios = () => {
  const [saques, setSaques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSaques() {
      try {
        setLoading(true);
        setError(null);
        const result = await postData('/admin/relatorio-saques', {});
        if (Array.isArray(result)) {
          setSaques(result);
        } else {
          setSaques([]);
        }
      } catch (error) {
        console.error('Erro ao buscar saques:', error);
        setError('Não foi possível carregar os dados dos saques. Tente novamente mais tarde.');
        setSaques([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSaques();
  }, []);

  const handleExport = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const url = API_URL + '/admin/exportar/saques-csv';
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="bg-background text-foreground min-h-screen p-6">
        <div className="bg-card p-8 rounded shadow-md max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-yellow-600">Relatório de Saques</h1>
            <button
              onClick={handleExport}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Exportar CSV
            </button>
          </div>
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-2"></div>
            <p className="text-gray-400">Carregando dados dos saques...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background text-foreground min-h-screen p-6">
        <div className="bg-card p-8 rounded shadow-md max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-yellow-600">Relatório de Saques</h1>
            <button
              onClick={handleExport}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Exportar CSV
            </button>
          </div>
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-yellow-600">Relatório de Saques</h1>
          <button
            onClick={handleExport}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Exportar CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 border-b">ID</th>
                <th className="text-left p-3 border-b">Usuário</th>
                <th className="text-left p-3 border-b">Valor</th>
                <th className="text-left p-3 border-b">Status</th>
                <th className="text-left p-3 border-b">Data</th>
              </tr>
            </thead>
            <tbody>
              {saques.map((saque, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{saque.id}</td>
                  <td className="p-3 border-b">{saque.user_id}</td>
                  <td className="p-3 border-b">R$ {saque.amount.toFixed(2)}</td>
                  <td className="p-3 border-b">{saque.status}</td>
                  <td className="p-3 border-b">{new Date(saque.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {saques.length === 0 && (
            <p className="text-gray-500 mt-4">Nenhum saque registrado ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaqueUsuarios;
