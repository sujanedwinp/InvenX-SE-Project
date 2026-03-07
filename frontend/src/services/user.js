import { apiFetch, getToken } from "./api";

export async function updateColors(colors) {
    return apiFetch("/api/user/colors", {
        method: "PATCH",
        token: getToken(),
        body: JSON.stringify(colors)
    });
}

export async function changePassword(payload) {
    return apiFetch("/api/user/password", {
        method: "PATCH",
        token: getToken(),
        body: JSON.stringify(payload)
    });
}
