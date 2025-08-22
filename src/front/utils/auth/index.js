const KEY = "access_token";
export function saveToken(t) {
  sessionStorage.setItem(KEY, t);
}
export function getToken() {
  return sessionStorage.getItem(KEY);
}
export function clearToken() {
  sessionStorage.removeItem(KEY);
}
export function isLoggedIn() {
  return !!getToken();
}
