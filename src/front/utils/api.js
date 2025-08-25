<<<<<<< HEAD
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
=======
// Asegura barra final y usa JSON sólo si el servidor manda JSON
const BASE = (import.meta.env.VITE_BACKEND_URL || "")
  .trim()
  .replace(/\/?$/, "/");

async function parse(r) {
  const ct = r.headers.get("content-type") || "";
  if (ct.includes("application/json")) return await r.json();
  const text = await r.text();
  try {
    return JSON.parse(text);
  } catch {
    return { msg: text || r.statusText };
  }
}
async function request(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, {
    headers: { Accept: "application/json", ...options.headers },
    ...options,
  });
  const data = await parse(res);
  if (!res.ok) throw new Error(data?.msg || `HTTP ${res.status}`);
>>>>>>> origin/Back-work
  return data;
}

export function apiSignup(payload) {
<<<<<<< HEAD
  // payload: { name, last_name, email, password, role }
  return request("/api/signup", {
    method: "POST",
=======
  return request("api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
>>>>>>> origin/Back-work
    body: JSON.stringify(payload),
  });
}

export function apiLogin(email, password) {
<<<<<<< HEAD
  // devuelve { access_token }
  return request("/api/login", {
    method: "POST",
=======
  return request("api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
>>>>>>> origin/Back-work
    body: JSON.stringify({ email, password }),
  });
}

<<<<<<< HEAD
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
=======
export function apiProfile(token) {
  return request("api/profile", {
    headers: { Authorization: `Bearer ${token}` },
>>>>>>> origin/Back-work
  });
}
