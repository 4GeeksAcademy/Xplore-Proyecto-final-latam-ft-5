// bookings.js
const KEY = "xplora_bookings";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function save(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function getBookings() {
  return load();
}

export function addBooking(b) {
  const list = load();
  const id = crypto.randomUUID();
  const item = { id, createdAt: Date.now(), status: "reserved", ...b };
  list.push(item);
  save(list);
  return item;
}

export function cancelBooking(id) {
  const list = load().map((b) =>
    b.id === id ? { ...b, status: "canceled" } : b
  );
  save(list);
}

export function nextBooking() {
  const future = load()
    .filter((b) => b.status === "reserved")
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  return future[0] || null;
}
