import { getToken, logout } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://goldeouro-backend-v2.fly.dev";

const redirectToLogin = () => {
  logout();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (response.status === 401 || response.status === 403) {
    redirectToLogin();
    throw new Error("Sessão expirada ou não autorizada.");
  }

  return response;
};

export const getData = async (endpoint) => {
  const response = await request(endpoint, { method: "GET" });
  return await response.json();
};

export const postData = async (endpoint, body) => {
  const response = await request(endpoint, {
    method: "POST",
    body: JSON.stringify(body)
  });
  return await response.json();
};
