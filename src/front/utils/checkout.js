// src/front/utils/checkout.js
const KEY = "xplora_checkout";

export function setCheckout(patch) {
  const prev = getCheckout();
  const data = { ...prev, ...patch };
  sessionStorage.setItem(KEY, JSON.stringify(data));
  return data;
}

export function getCheckout() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function clearCheckout() {
  sessionStorage.removeItem(KEY);
}

// Alias para compatibilidad con código que importe saveCheckout
export const saveCheckout = setCheckout;
