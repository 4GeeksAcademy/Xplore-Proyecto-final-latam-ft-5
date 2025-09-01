// src/front/utils/reservations.js
const KEY = "xplora_reservations_v1";

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function getReservations() {
  return read().sort(
    (a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime()
  );
}

export function getReservation(id) {
  return read().find((r) => String(r.id) === String(id)) || null;
}

export function addReservation({
  tourId,
  dateISO,
  pax = 1,
  method = "card",
  code,
  notes = "",
}) {
  const list = read();
  const id = Date.now(); // suficiente para mock
  list.push({
    id,
    tourId: Number(tourId),
    dateISO,
    people: pax,
    method,
    code,
    notes,
    createdAt: new Date().toISOString(),
  });
  write(list);
  return id;
}

export function isReserved(tourId) {
  const t = Number(tourId);
  return read().some((r) => Number(r.tourId) === t);
}

export function getNextReservation() {
  const now = Date.now();
  return (
    getReservations().find((r) => new Date(r.dateISO).getTime() >= now) || null
  );
}

export function clearReservations() {
  localStorage.removeItem(KEY);
}
