import { useEffect, useState } from 'react';
import { postData } from '../api';

export default function Logs() {
  const [logs, setLogs] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await postData('/admin/logs', {});
      setLogs(result);
    }
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📜 Logs do Sistema</h1>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(logs, null, 2)}</pre>
    </div>
  );
}
