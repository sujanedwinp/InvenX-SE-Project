import { apiFetch, getToken } from "./api";

export async function listInventory() {
  return apiFetch("/api/inventory", { token: getToken() });
}

export async function getInventoryItem(id) {
  return apiFetch(`/api/inventory/${id}`, { token: getToken() });
}

export async function createInventoryItem(payload) {
  return apiFetch("/api/inventory", {
    token: getToken(),
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function updateInventoryItem(id, payload) {
  return apiFetch(`/api/inventory/${id}`, {
    token: getToken(),
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export async function deleteInventoryItem(id) {
  return apiFetch(`/api/inventory/${id}`, {
    token: getToken(),
    method: "DELETE"
  });
}

export async function incInventoryQty(id, delta) {
  return apiFetch(`/api/inventory/${id}/quantity`, {
    token: getToken(),
    method: "PATCH",
    body: JSON.stringify({ delta })
  });
}

export async function setInventoryPrice(id, price) {
  return apiFetch(`/api/inventory/${id}/price`, {
    token: getToken(),
    method: "PATCH",
    body: JSON.stringify({ price })
  });
}

export async function fetchDashboardStats() {
  return apiFetch("/api/dashboard/stats", { token: getToken() });
}

