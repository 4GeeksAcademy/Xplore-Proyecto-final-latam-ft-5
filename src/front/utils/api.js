// api.js
const BASE =
  import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "") ||
  "http://127.0.0.1:3001";

export async function apiLogin(email, password) {
  const res = await fetch(`${BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.msg || "Login failed");
  return data; // { access_token }
}

export async function apiSignup(payload) {
  const res = await fetch(`${BASE}/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.msg || "Signup failed");
  return data;
}

export async function apiProfile(token) {
  const res = await fetch(`${BASE}/api/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.msg || "Profile failed");
  return data;
}
