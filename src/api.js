const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function postData(endpoint, data) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': 'goldeouro123'
    },
    body: JSON.stringify(data)
  });

  return response.json();
}
