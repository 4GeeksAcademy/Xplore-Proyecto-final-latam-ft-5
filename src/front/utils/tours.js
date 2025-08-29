/* =========================
   TOURS API (comentado)
   ========================= */

/**
 * @typedef {Object} ToursQuery
 * @property {string=} q           Búsqueda por texto (título/ciudad)
 * @property {string=} city        Filtro por ciudad/país
 * @property {number=} min_price   Precio mínimo
 * @property {number=} max_price   Precio máximo
 * @property {string[]=} tags      Etiquetas (aventura, cultura, etc.)
 * @property {number=} page        Página (1-based)
 * @property {number=} page_size   Tamaño de página
 * @property {string=} sort        Orden (p.ej. "price_asc", "rating_desc")
 */

/**
 * GET /api/tours
 * Devuelve lista paginada de tours publicados
 * Respuesta sugerida: { items: Tour[], total: number, page: number, page_size: number }
 */
// export async function apiTours(params /** @type {ToursQuery} */ = {}) {
//   const url = new URL(`${API_URL}/api/tours`);
//   // mapea params → querystring
//   Object.entries(params).forEach(([k, v]) => {
//     if (v === undefined || v === null || v === "") return;
//     if (Array.isArray(v)) v.forEach((x) => url.searchParams.append(k, String(x)));
//     else url.searchParams.set(k, String(v));
//   });
//   const res = await fetch(url.toString(), { headers: { "Accept": "application/json" } });
//   return handleResponse(res);
// }

/**
 * GET /api/tours/:id
 * Devuelve el detalle de un tour
 */
// export async function apiTourById(id) {
//   const res = await fetch(`${API_URL}/api/tours/${id}`, { headers: { "Accept": "application/json" } });
//   return handleResponse(res);
// }

/* Opcional: endpoints para el flujo del guía (crear/editar/publicar)
   Requieren JWT (Authorization: Bearer <token>)

export async function apiCreateTour(token, payload) {
  const res = await fetch(`${API_URL}/api/tours`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function apiPublishTour(token, tourId) {
  const res = await fetch(`${API_URL}/api/tours/${tourId}/publish`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` }
  });
  return handleResponse(res);
}

*/
