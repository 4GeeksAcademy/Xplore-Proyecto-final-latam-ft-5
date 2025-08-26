import { getToken } from "./auth";

const BASE = import.meta.env.VITE_BACKEND_URL; // ej: http://127.0.0.1:3001 (sin /api)

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.msg || data?.error || res.statusText;
    throw new Error(msg);
  }
  return data;
}

export const apiSignup = (payload) =>
  request("/api/signup", { method: "POST", body: JSON.stringify(payload) });

export const apiLogin = (email, password) =>
  request("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const apiProfile = () => request("/api/profile", { method: "GET" });

export default { request, apiSignup, apiLogin, apiProfile };
