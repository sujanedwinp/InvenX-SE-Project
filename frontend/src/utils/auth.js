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

export const loginUser = async (credentials) => {
    try {
        // Map camelCase dbId to backend expectation if needed, or pass as is
        // Assuming backend accepts 'dbid' or 'dbId' based on AuthContext usage showing 'dbid'
        const payload = {
            dbid: credentials.dbId || credentials.dbid,
            password: credentials.password
        };

        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            setToken(data.token);
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return { success: true, user: data.user };
        } else {
            return { success: false, error: data.message || 'Login failed' };
        }
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: 'Network error or server unreachable' };
    }
};

export const registerUser = async (userData) => {
    try {
        const payload = {
            name: userData.name,
            dbid: userData.dbId || userData.dbid, // Consistency
            password: userData.password
        };

        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            // Usually register doesn't auto-login or return token instantly in strict patterns, 
            // but if it does, we could save it. For now just return success.
            return { success: true };
        } else {
            return { success: false, error: data.message || 'Registration failed' };
        }
    } catch (error) {
        console.error("Register error:", error);
        return { success: false, error: 'Network error or server unreachable' };
    }
};
