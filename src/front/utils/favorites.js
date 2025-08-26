// src/front/utils/favorites.js
const KEY = "xplora_favorites";

// ---- helpers ----
function setFavorites(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
  // avisar al resto de la app que cambió la lista
  window.dispatchEvent(
    new CustomEvent("xplora:favorites:updated", { detail: list })
  );
}

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function isFavorite(id) {
  return getFavorites().some((f) => String(f.id) === String(id));
}

export function addFavorite(item) {
  const list = getFavorites();
  if (!isFavorite(item.id)) {
    setFavorites([{ ...item }, ...list]);
  }
}

export function removeFavorite(id) {
  const list = getFavorites().filter((f) => String(f.id) !== String(id));
  setFavorites(list);
}

export function toggleFavorite(item) {
  if (isFavorite(item.id)) removeFavorite(item.id);
  else addFavorite(item);
}

export function clearFavorites() {
  setFavorites([]);
}
