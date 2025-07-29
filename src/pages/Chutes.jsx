import { useEffect, useState } from 'react';
import { postData } from '../js/api';

export default function Chutes() {
  const [chutes, setChutes] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await postData('/admin/chutes-recentes', {});
      setChutes(result);
    }
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🥅 Chutes Recentes</h1>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(chutes, null, 2)}</pre>
    </div>
  );
}
