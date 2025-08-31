// src/front/utils/apiGuias.js
const API_URL = (
  import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000"
).replace(/\/+$/, ""); // quita / finales

async function postJSON(path, body) {
  const resp = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let data = {};
  try {
    data = await resp.json();
  } catch {}
  if (!resp.ok)
    throw new Error(data?.msg || data?.error || `HTTP ${resp.status}`);
  return data;
}

// ⚠️ Aquí SÍ añadimos /api porque el blueprint está montado en /api en Flask
export const apiProveedorSignup = (payload) =>
  postJSON("/api/proveedor/signup", payload);

export const apiProveedorLogin = (email, password) =>
  postJSON("/api/proveedor/login", { email, password });
