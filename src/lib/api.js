const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

function buildUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${p}`;
}

export async function getJson(path, opts = {}) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(buildUrl(path), {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      signal: ctrl.signal,
      headers: { 'Accept': 'application/json' },
      ...opts
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${res.statusText} - ${txt?.slice(0,200)}`);
    }
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}
