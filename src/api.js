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

    return await response.json();
  } catch (error) {
    console.error('Erro na requisição:', error);
    return { error: 'Erro na conexão com o servidor' };
  }
}
