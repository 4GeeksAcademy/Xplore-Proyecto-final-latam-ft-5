// src/front/utils/bookings.js
const KEY = "xplora_bookings_v1";

export function getBookings() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

function save(bookings) {
  localStorage.setItem(KEY, JSON.stringify(bookings));
}

export function addBooking(booking) {
  const bookings = getBookings();
  // Evitar duplicados por confirmationCode si existe
  if (booking?.confirmationCode) {
    const exists = bookings.some(
      (b) => b.confirmationCode === booking.confirmationCode
    );
    if (exists) return booking;
  }
  const withId = {
    id: booking.id || String(Date.now()),
    createdAt: new Date().toISOString(),
    status: "reserved",
    ...booking,
  };
  bookings.push(withId);
  save(bookings);
  return withId;
}

export function removeBooking(id) {
  save(getBookings().filter((b) => b.id !== id));
}

export function getBookingById(id) {
  return getBookings().find((b) => b.id === id);
}

export function getUpcomingBookings() {
  const today = new Date();
  return getBookings()
    .filter((b) => new Date(b.date) >= new Date(today.toDateString()))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

export function daysUntil(dateStr) {
  const d1 = new Date(new Date().toDateString());
  const d2 = new Date(dateStr);
  return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
}
