// src/front/utils/apiTours.js
import { getToken } from "./auth";

const API_URL = (
  import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000"
).replace(/\/+$/, "");

export async function createTour(payload) {
  const token = getToken();
  const resp = await fetch(`${API_URL}/api/tours`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok)
    throw new Error(data?.msg || data?.error || `Error ${resp.status}`);
  return data; // idealmente { id, ... }
}
