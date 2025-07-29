import { useEffect, useState } from 'react';
import { postData } from '../js/api';

export default function TodosUsuarios() {
  const [usuarios, setUsuarios] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await postData('/admin/usuarios', {});
      setUsuarios(result);
    }
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">👥 Todos os Usuários</h1>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(usuarios, null, 2)}</pre>
    </div>
  );
}
