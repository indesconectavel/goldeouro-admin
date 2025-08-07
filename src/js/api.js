export const postData = async (endpoint, body) => {
  const response = await fetch(import.meta.env.VITE_API_URL + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': 'goldeouro123',
    },
    body: JSON.stringify(body)
  });
  return await response.json();
};

export const getData = async (endpoint) => {
  const response = await fetch(import.meta.env.VITE_API_URL + endpoint, {
    method: 'GET',
    headers: {
      'x-admin-token': 'goldeouro123',
    }
  });
  return await response.json();
};

export default {
  post: postData,
  get: getData
};
