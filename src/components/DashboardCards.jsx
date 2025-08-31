import { useEffect, useState } from "react";
import { getDashboard } from "../lib/api";

export default function DashboardCards() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    getDashboard()
      .then((json) => { if (alive) setData(json); })
      .catch((e) => { if (alive) setErr(e.message); });
    return () => { alive = false; };
  }, []);

  if (err) return <div style={{color:'#f66'}}>Erro: {err}</div>;
  if (!data) return <div>Carregando dados...</div>;

  const { players=0, matches=0, guesses=0, recent_matches=[] } = data;

  return (
    <div className="grid gap-4">
      <div className="card">Jogadores: <b>{players}</b></div>
      <div className="card">Partidas: <b>{matches}</b></div>
      <div className="card">Palpites: <b>{guesses}</b></div>

      <div className="card">
        <h3>Últimas partidas</h3>
        <table>
          <thead><tr><th>Casa</th><th>Fora</th><th>Status</th><th>Kickoff</th></tr></thead>
          <tbody>
            {recent_matches.map((m) => (
              <tr key={m.id}>
                <td>{m.home}</td>
                <td>{m.away}</td>
                <td>{m.status}</td>
                <td>{new Date(m.kickoff).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
