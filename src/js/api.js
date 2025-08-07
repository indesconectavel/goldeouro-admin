export const postData = async (endpoint, body) => {
  const response = await fetch(import.meta.env.VITE_API_URL + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': 'goldeouro123', // Token fixo, funciona para todos os endpoints admin
    },
    body: JSON.stringify(body)
  });
  return await response.json();
};
