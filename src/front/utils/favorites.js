// src/front/utils/favorites.js
const KEY = "xplora_favorites";

// ---- helpers base ----
function setFavorites(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(
    new CustomEvent("xplora:favorites:updated", { detail: list })
  );
}

export function getFavorites() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    // normaliza lo viejo que ya esté guardado
    return raw.map(normalizeItem).filter(Boolean);
  } catch {
    return [];
  }
}

export function isFavorite(id) {
  return getFavorites().some((f) => String(f.id) === String(id));
}

export function clearFavorites() {
  setFavorites([]);
}

export function removeFavorite(id) {
  const list = getFavorites().filter((f) => String(f.id) !== String(id));
  setFavorites(list);
}

// ===== Normalizador (la clave para que siempre haya imagen si existe) =====
function normalizeItem(item) {
  if (!item) return null;
  const id = item.id ?? item.tourId ?? item._id;
  if (id == null) return null;

  // Unificamos nombres: image | img | cover | gallery[0]
  const image =
    item.image ||
    item.img ||
    item.cover ||
    (Array.isArray(item.gallery) && item.gallery[0]) ||
    undefined;

  const location = item.location || item.city || item.subtitle || undefined;
  const tags = Array.isArray(item.tags) ? item.tags : [];

  return {
    id: String(id),
    title: item.title || item.name || `Tour #${id}`,
    image,
    location,
    tags,
    price: item.price ?? item.base_price ?? undefined,
  };
}

// ===== API para agregar / alternar favoritos =====
export function addFavorite(item) {
  const list = getFavorites();
  const norm = normalizeItem(item);
  if (!norm) return;

  // si ya existe, reemplaza por la versión "completa" (para actualizar imagen/tags)
  const idx = list.findIndex((f) => String(f.id) === String(norm.id));
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...norm };
  } else {
    list.unshift(norm);
  }
  setFavorites(list);
}

export function toggleFavorite(itemOrId) {
  // si pasaron sólo id
  if (typeof itemOrId === "string" || typeof itemOrId === "number") {
    if (isFavorite(itemOrId)) removeFavorite(itemOrId);
    // si no existe y sólo tenemos id, no sabemos qué imagen guardar → no hacemos add
    return;
  }
  // si pasaron objeto
  const norm = normalizeItem(itemOrId);
  if (!norm) return;
  if (isFavorite(norm.id)) removeFavorite(norm.id);
  else addFavorite(norm);
}

// ===== Helpers opcionales para construir favoritos desde estructuras comunes =====
export const makeFavFromTour = (t) =>
  normalizeItem({
    id: t.id,
    title: t.title,
    image: t.img ?? t.cover,
    city: t.city,
    tags: t.tags,
    price: t.price ?? t.base_price,
  });
