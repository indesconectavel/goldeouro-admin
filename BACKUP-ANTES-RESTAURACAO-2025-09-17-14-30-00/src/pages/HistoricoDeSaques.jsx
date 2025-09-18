import { useEffect, useState } from 'react';
import { postData } from '../js/api';

export default function HistoricoDeSaques() {
  const [saques, setSaques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSaques() {
      try {
        setLoading(true);
        setError(null);
        const result = await postData('/admin/saques/todos', {});
        setSaques(result.saques || []);
      } catch (error) {
        console.error('Erro ao buscar histórico de saques:', error);
        setError('Não foi possível carregar o histórico de saques. Tente novamente mais tarde.');
        setSaques([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSaques();
  }, []);

  if (loading) {
    return (
      <div className="bg-background text-foreground min-h-screen p-6">
        <div className="bg-card p-8 rounded shadow-md max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-yellow-600 mb-4">Histórico de Saques</h1>
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-2"></div>
            <p className="text-gray-400">Carregando histórico de saques...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background text-foreground min-h-screen p-6">
        <div className="bg-card p-8 rounded shadow-md max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-yellow-600 mb-4">Histórico de Saques</h1>
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
        <h1 className="text-2xl font-bold text-yellow-600 mb-4">Histórico de Saques</h1>
        {saques.length === 0 ? (
          <p className="text-gray-700 text-center p-8">Nenhum saque registrado.</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 shadow-md">
            <thead>
              <tr className="bg-yellow-100">
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Usuário</th>
                <th className="py-2 px-4 border-b">Valor</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Data</th>
              </tr>
            </thead>
            <tbody>
              {saques.map((saque) => (
                <tr key={saque.id}>
                  <td className="py-2 px-4 border-b">{saque.id}</td>
                  <td className="py-2 px-4 border-b">{saque.user_id}</td>
                  <td className="py-2 px-4 border-b">R$ {saque.amount.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">{saque.status}</td>
                  <td className="py-2 px-4 border-b">{new Date(saque.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
