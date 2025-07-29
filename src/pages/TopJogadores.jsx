import { useEffect, useState } from 'react';
import { postData } from '../js/api';

export default function TopJogadores() {
  const [top, setTop] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await postData('/admin/top-jogadores', {});
      setTop(result);
    }
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🏆 Top Jogadores</h1>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(top, null, 2)}</pre>
    </div>
  );
}
