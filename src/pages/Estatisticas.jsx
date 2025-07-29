import { useEffect, useState } from 'react';
import { postData } from '../js/api';

export default function Estatisticas() {
  const [estatisticas, setEstatisticas] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await postData('/admin/estatisticas', {});
      setEstatisticas(result);
    }
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📈 Estatísticas Gerais</h1>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(estatisticas, null, 2)}</pre>
    </div>
  );
}
