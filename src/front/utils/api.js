// src/front/utils/api.js

// Usa el puerto donde corre tu backend (5000 en tu caso actual)
const API_URL = (
  import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000"
).replace(/\/+$/, "");

// Helper común para manejar respuestas JSON/errores
async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.msg || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

// ---------- NO TOCAR PABLO ----------
//utils / api.js;
export async function apiLogin(emailOrObj, passwordMaybe) {
  const email = typeof emailOrObj === "object" ? emailOrObj.email : emailOrObj;
  const password =
    typeof emailOrObj === "object" ? emailOrObj.password : passwordMaybe;
  const res = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.msg || `HTTP ${res.status}`);
  return data;
}

// ---------- ------------ ----------

export async function apiSignup(payload) {
  const res = await fetch(`${API_URL}/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function apiProfile(token) {
  const res = await fetch(`${API_URL}/api/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function apiUpdateProfile(token, payload) {
  const res = await fetch(`${API_URL}/api/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// (Opcional) expón API_URL por si lo necesitas en otros módulos
export { API_URL };
