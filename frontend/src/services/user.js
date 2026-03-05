import { apiFetch, getToken } from "./api";

/**
 * PATCH /api/user/colors
 * Sends updated theme colors to the backend and returns the saved colors.
 * @param {{ bg: string, chart: string, border: string, font: string }} colors
 */
export async function updateColors(colors) {
    return apiFetch("/api/user/colors", {
        method: "PATCH",
        token: getToken(),
        body: JSON.stringify(colors)
    });
}

/**
 * PATCH /api/user/password
 * Changes the user's password. Only succeeds if loginMethod === "username".
 * @param {{ currentPassword: string, newPassword: string }} payload
 */
export async function changePassword(payload) {
    return apiFetch("/api/user/password", {
        method: "PATCH",
        token: getToken(),
        body: JSON.stringify(payload)
    });
}
