// auth.js
const KEY = "xplora_token";

export function saveToken(token) {
  localStorage.setItem(KEY, token);
}
export function getToken() {
  return localStorage.getItem(KEY) || "";
}
export function clearToken() {
  localStorage.removeItem(KEY);
}
export function isLoggedIn() {
  return Boolean(getToken());
}

//USUARIO
export function setUserLocal(user) {
  localStorage.setItem("usr", JSON.stringify(user));
}
export function getUserLocal() {
  return JSON.parse(localStorage.getItem("usr"));
}

// Helper para llamadas autenticadas si luego conectan API real
export async function authFetch(url, opts = {}) {
  const token = getToken();
  const headers = { ...(opts.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { ...opts, headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
