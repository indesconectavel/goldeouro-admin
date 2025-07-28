import { useEffect, useState } from 'react';
import { postData } from '../api';

export default function Bloqueados() {
  const [bloqueados, setBloqueados] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await postData('/admin/usuarios-bloqueados', {});
      setBloqueados(result);
    }
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">⛔ Usuários Bloqueados</h1>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(bloqueados, null, 2)}</pre>
    </div>
  );
}
