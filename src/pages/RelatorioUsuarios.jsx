import { useEffect, useState } from 'react';
import { postData } from '../js/api';

export default function RelatorioUsuarios() {
  const [relatorio, setRelatorio] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await postData('/admin/relatorio-usuarios', {});
      setRelatorio(result);
    }
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📑 Relatório por Usuário</h1>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(relatorio, null, 2)}</pre>
    </div>
  );
}
