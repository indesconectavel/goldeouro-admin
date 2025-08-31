const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function getDashboard() {
  const res = await fetch(`${API_BASE}/api/public/dashboard`, {
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) {
    const txt = await res.text().catch(()=>'');
    throw new Error(`Dashboard HTTP ${res.status} ${txt}`);
  }
  return res.json();
}
