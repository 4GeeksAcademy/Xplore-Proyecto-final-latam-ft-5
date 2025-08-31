// // auth.js
// const KEY = "xplora_token";

// export function saveToken(token) {
//   localStorage.setItem(KEY, token);
// }
// export function getToken() {
//   return localStorage.getItem(KEY) || "";
// }
// export function clearToken() {
//   localStorage.removeItem(KEY);
// }
// export function isLoggedIn() {
//   return Boolean(getToken());
// }

// src/front/utils/auth.js
// src/front/utils/apiAuth.js
// src/front/utils/auth.js
const TOKEN_KEY = "xplora_token";
const USER_KEY = "xplora_user";

// ===== token =====
export const saveToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const getToken = () => localStorage.getItem(TOKEN_KEY) || "";
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);
export const isLoggedIn = () => Boolean(getToken());

// ===== usuario (para roles, nombre, etc.) =====
export const saveUser = (u) =>
  localStorage.setItem(USER_KEY, JSON.stringify(u || {}));
export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "{}");
  } catch {
    return {};
  }
};
export const clearUser = () => localStorage.removeItem(USER_KEY);

// ===== roles (si tu backend envía user.roles = ["TRAVELER","PROVIDER"]) =====
export const getRoles = () => {
  const u = getUser();
  return Array.isArray(u?.roles)
    ? u.roles.map((r) => String(r).toUpperCase())
    : [];
};
export const hasRole = (r) => getRoles().includes(String(r).toUpperCase());

// ===== helper cómodo para salir =====
export const clearSession = () => {
  clearToken();
  clearUser();
};
