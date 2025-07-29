import { useEffect, useState } from 'react';
import { postData } from '../js/api';

export default function Transacoes() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await postData('/admin/transacoes-recentes', {});
      setDados(result);
    }
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">💸 Transações Recentes</h1>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(dados, null, 2)}</pre>
    </div>
  );
}
