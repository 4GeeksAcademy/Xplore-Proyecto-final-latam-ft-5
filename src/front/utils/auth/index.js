const TOKEN_KEY = "xplora_token";

export function saveToken(token) {
  try {
    if (!token) {
      console.error("Intento de guardar token vacío");
      return false;
    }
    localStorage.setItem(TOKEN_KEY, token);
    console.log("Token guardado exitosamente");
    return true;
  } catch (error) {
    console.error("Error al guardar token:", error);
    return false;
  }
}

export function getToken() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      console.log("No hay token almacenado");
      return null;
    }
    return token;
  } catch (error) {
    console.error("Error al obtener token:", error);
    return null;
  }
}

export function isLoggedIn() {
  const token = getToken();
  const isValid = !!token;
  console.log("Estado de autenticación:", { isValid, hasToken: !!token });
  return isValid;
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    console.log("Token eliminado exitosamente");
  } catch (error) {
    console.error("Error al eliminar token:", error);
  }
}
