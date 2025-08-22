const BASE = import.meta.env.VITE_BACKEND_URL; // p.ej. http://127.0.0.1:3001/

export async function apiSignup(data) {
  const r = await fetch(`${BASE}api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error((await safeMsg(r)) || "Signup error");
  return r.json();
}

export async function apiLogin(email, password) {
  const r = await fetch(`${BASE}api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!r.ok) throw new Error((await safeMsg(r)) || "Login error");
  return r.json(); // { access_token, user }
}

export async function apiProfile(token) {
  const r = await fetch(`${BASE}api/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) throw new Error((await safeMsg(r)) || "Profile error");
  return r.json();
}

async function safeMsg(r) {
  try {
    const j = await r.json();
    return j?.msg;
  } catch {
    return null;
  }
}
