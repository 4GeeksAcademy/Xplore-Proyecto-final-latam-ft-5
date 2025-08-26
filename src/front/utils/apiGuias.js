const BASE = (
  import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:3001"
).replace(/\/+$/, "");


async function proveedorRequest(path, options = {}) {
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
    throw new Error(msg || "Error en la petición de proveedor");
  }
  return data;
}

// Registro proveedor
export function apiProveedorSignup(payload) {
  return proveedorRequest("/api/proveedor/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

//proximo login
export function apiProveedorLogin(email, password) {
  return proveedorRequest("/api/proveedor/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}