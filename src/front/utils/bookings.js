// src/front/utils/bookings.js
const KEY = "xplora_bookings";
const EVT = "xplora:bookings:updated";

// ---------- storage helpers ----------
function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function save(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
  // avisar al resto de la app
  window.dispatchEvent(new CustomEvent(EVT, { detail: list }));
}

// ---------- public API ----------
export function getBookings() {
  return load();
}

export function addBooking(b) {
  const list = load();

  // id robusto
  let id;
  try {
    id = crypto.randomUUID();
  } catch {
    id = `bk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  // normaliza campos típicos
  const item = {
    id,
    createdAt: Date.now(),
    status: "reserved",
    title: b.title || `Tour #${b.tourId || "?"}`,
    tourId: b.tourId ?? null,
    date: b.date, // string "YYYY-MM-DD" o ISO; el panel lo formatea con new Date()
    people: Number(b.people || 1),
    total: Number(b.total || 0),
    paymentMethod: b.paymentMethod || "card",
    confirmationCode: b.confirmationCode || "",
    notes: b.notes || "",
    // permite campos extra sin romper
    ...b,
  };

  list.push(item);
  save(list);
  return item;
}

export function cancelBooking(id) {
  const list = load().map((b) =>
    String(b.id) === String(id) ? { ...b, status: "canceled" } : b
  );
  save(list);
}

export function clearBookings() {
  save([]);
}

/** próxima reserva futura (ordenada cronológicamente, sin canceladas) */
export function nextBooking() {
  const today = new Date();
  const future = load()
    .filter((b) => b.status === "reserved")
    .filter((b) => {
      const d = new Date(b.date);
      return (
        d.toString() !== "Invalid Date" && d >= new Date(today.toDateString())
      );
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return future[0] || null;
}

// expone el nombre del evento para que otros módulos lo usen si quieren
export const BOOKINGS_UPDATED_EVENT = EVT;
