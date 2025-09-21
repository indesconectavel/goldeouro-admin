export const getData = async (endpoint) => {
  const response = await fetch(import.meta.env.VITE_API_URL + endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': import.meta.env.VITE_ADMIN_TOKEN,
    }
  });
  return await response.json();
};

export const postData = async (endpoint, body) => {
  const response = await fetch(import.meta.env.VITE_API_URL + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': import.meta.env.VITE_ADMIN_TOKEN,
    },
    body: JSON.stringify(body)
  });
  return await response.json();
};
