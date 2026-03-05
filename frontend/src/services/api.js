import API_URL from "../api";
const API_BASE = API_URL;

export function getToken() {
  return localStorage.getItem("invenx_token");
}

export function setToken(token) {
  localStorage.setItem("invenx_token", token);
}

export function clearToken() {
  localStorage.removeItem("invenx_token");
}

export async function apiFetch(path, { token, headers, ...options } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const body = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const msg =
      typeof body === "object" && body && body.message ? body.message : `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return body;
}

