import { useEffect, useState } from 'react';
import { postData } from '../api';

export default function RelatorioSemanal() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await postData('/admin/relatorio-semanal', {});
      setData(result);
    }
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📊 Relatório Semanal</h1>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
