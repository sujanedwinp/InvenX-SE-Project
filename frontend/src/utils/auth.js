import API_URL from "../api";

export const getToken = () => {
    return localStorage.getItem('invenx_token');
};

export const setToken = (token) => {
    localStorage.setItem('invenx_token', token);
};

export const removeToken = () => {
    localStorage.removeItem('invenx_token');
};

export const isAuthenticated = () => {
    return !!getToken();
};

export const logout = () => {
    removeToken();
    localStorage.removeItem('user');
    window.location.href = '/login';
};

export const registerUser = async (userData) => {
    try {
        const payload = {
            name: userData.name,
            dbid: userData.dbId || userData.dbid,
            password: userData.password
        };

        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true };
        } else {
            return { success: false, error: data.message || 'Registration failed' };
        }
    } catch (error) {
        console.error("Register error:", error);
        return { success: false, error: 'Network error or server unreachable' };
    }
};
