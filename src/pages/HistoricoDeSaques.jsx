import { useEffect, useState } from 'react';
import { postData } from '../js/api';

export default function HistoricoDeSaques() {
  const [saques, setSaques] = useState([]);

  useEffect(() => {
    async function fetchSaques() {
      const result = await postData('/admin/saques/todos', {});
      setSaques(result.saques || []);
    }
    fetchSaques();
  }, []);

  return (
    <div className="p-8 ml-64 min-h-screen bg-white">
      <h1 className="text-2xl font-bold text-yellow-600 mb-4">Histórico de Saques</h1>
      {saques.length === 0 ? (
        <p className="text-gray-700">Nenhum saque registrado.</p>
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
  );
}
