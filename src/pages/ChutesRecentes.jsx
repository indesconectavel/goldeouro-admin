// src/pages/ChutesRecentes.jsx

import { useEffect, useState } from 'react';
import { postData } from '../js/api';
import Loader from '../components/Loader';

export default function ChutesRecentes() {
  const [chutes, setChutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChutes() {
      try {
        const data = await postData('/admin/chutes-recentes', {});
        setChutes(data);
      } catch (error) {
        console.error('Erro ao buscar chutes recentes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchChutes();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      <div className="bg-card p-6 rounded shadow-md max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-yellow-400 mb-4">Chutes Recentes</h1>
        <p className="text-muted-foreground mb-6">
          Listagem dos últimos chutes realizados nas partidas.
        </p>

        {chutes.length === 0 ? (
          <div className="text-center text-sm text-gray-400 mt-20">
            Ainda não há chutes registrados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-border rounded-lg shadow-sm text-sm">
              <thead className="bg-[#111827] text-yellow-300 uppercase">
                <tr>
                  <th className="px-4 py-3 border border-border">Jogador</th>
                  <th className="px-4 py-3 border border-border">Partida</th>
                  <th className="px-4 py-3 border border-border">Direção</th>
                  <th className="px-4 py-3 border border-border">Resultado</th>
                  <th className="px-4 py-3 border border-border">Data</th>
                </tr>
              </thead>
              <tbody>
                {chutes.map((chute) => (
                  <tr key={chute.id} className="text-center hover:bg-muted/30">
                    <td className="px-4 py-2 border border-border font-medium">{chute.user_name}</td>
                    <td className="px-4 py-2 border border-border">#{chute.game_id}</td>
                    <td className="px-4 py-2 border border-border">{chute.direction}</td>
                    <td className={`px-4 py-2 border border-border font-semibold ${chute.scored ? 'text-green-500' : 'text-red-500'}`}>
                      {chute.scored ? 'Gol' : 'Errou'}
                    </td>
                    <td className="px-4 py-2 border border-border">
                      {new Date(chute.created_at).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
