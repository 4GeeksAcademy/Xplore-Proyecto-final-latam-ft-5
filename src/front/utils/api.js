// src/front/utils/api.js
const BASE = (
  import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:3001"
).replace(/\/+$/, "");

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const msg = isJson ? data?.msg || data?.error : res.statusText;
    throw new Error(msg || "Request error");
  }
  return data;
}

export function apiSignup(payload) {
  // payload: { name, last_name, email, password, role }
  return request("/api/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function apiLogin(email, password) {
  // devuelve { access_token }
  return request("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function apiGetProfile(token) {
  return request("/api/profile", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

// Útil si quieres llamar a otros endpoints autenticados
export function apiAuthFetch(path, options = {}, token) {
  return request(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
}
