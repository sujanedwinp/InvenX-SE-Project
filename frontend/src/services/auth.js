import { apiFetch, clearToken, getToken, setToken } from "./api";

export async function loginWithDbid({ dbid, password }) {
  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ dbid, password })
  });

  setToken(data.token);
  localStorage.setItem("invenx_user", JSON.stringify(data.user));

  return data;
}

export function logout() {
  clearToken();
  localStorage.removeItem("invenx_user");
}

export function getStoredUser() {
  const raw = localStorage.getItem("invenx_user");
  return raw ? JSON.parse(raw) : null;
}

export async function fetchMe() {
  const token = getToken();
  if (!token) return null;
  const data = await apiFetch("/api/auth/me", { token });
  return data.user;
}

