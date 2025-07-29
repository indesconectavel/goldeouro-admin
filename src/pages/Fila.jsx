import { useEffect, useState } from 'react';
import { postData } from '../js/api';

export default function Fila() {
  const [fila, setFila] = useState(null);

  useEffect(() => {
    async function fetchFila() {
      const result = await postData('/admin/controle-fila', {});
      setFila(result);
    }
    fetchFila();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📋 Fila de Jogadores</h1>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(fila, null, 2)}</pre>
    </div>
  );
}
