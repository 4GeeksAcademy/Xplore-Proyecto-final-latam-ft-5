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
  return data;
}

export function apiSignup(payload) {
  return request("api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function apiLogin(email, password) {
  return request("api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export function apiProfile(token) {
  return request("api/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
