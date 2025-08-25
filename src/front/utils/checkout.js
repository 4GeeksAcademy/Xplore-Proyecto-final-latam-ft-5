const KEY = "xplora_checkout";

export function getCheckout() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveCheckout(patch) {
  const data = { ...getCheckout(), ...patch };
  localStorage.setItem(KEY, JSON.stringify(data));
  return data;
}

export function clearCheckout() {
  localStorage.removeItem(KEY);
}
