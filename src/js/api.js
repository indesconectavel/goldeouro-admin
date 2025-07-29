const API_URL = 'https://goldeouro-backend.onrender.com';

export async function postData(endpoint, data) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': 'goldeouro123'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.error || 'Erro desconhecido');
    }

    return result;
  } catch (error) {
    console.error('❌ Erro detalhado:', error);
    return { error: error.message || 'Erro na conexão com o servidor' };
  }
}
