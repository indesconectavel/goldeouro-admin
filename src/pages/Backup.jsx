import { useEffect, useState } from 'react';
import { postData } from '../api';

export default function Backup() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await postData('/admin/backup-status', {});
      setStatus(result);
    }
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🗂️ Status do Backup</h1>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(status, null, 2)}</pre>
    </div>
  );
}
