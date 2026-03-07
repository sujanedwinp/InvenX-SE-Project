import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchMe, getStoredUser, loginWithDbid, logout } from "../services/auth";
import { useTheme } from "./ThemeContext";

const AuthContext = createContext({
  user: null,
  token: null,
  login: async () => { },
  logout: () => { },
  updateUser: () => { },
  isLoading: true
});

function persistUser(userObj) {
  localStorage.setItem("invenx_user", JSON.stringify(userObj));
  return userObj;
}

function isValidColors(c) {
  return c && c.bg && c.chart && c.border && c.font;
}

export function AuthProvider({ children }) {
  const { setTheme } = useTheme();

  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(localStorage.getItem("invenx_token"));
  const [isLoading, setIsLoading] = useState(true);

 
  const updateUser = useCallback((patch) => {
    setUser(prev => persistUser({ ...prev, ...patch }));
  }, []);

  
  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (!token) {
        if (!cancelled) setIsLoading(false);
        return;
      }

      try {
        const me = await fetchMe(); 
        if (cancelled) return;
        if (!me) return;

        const stored = getStoredUser() || {};
        const merged = {
          ...stored,
          ...me,
          colors: isValidColors(me.colors) ? me.colors : stored.colors
        };

        setUser(merged);
        persistUser(merged);

        const themeToApply = isValidColors(me.colors) ? me.colors : stored.colors;
        if (isValidColors(themeToApply)) setTheme(themeToApply);

      } catch (err) {
        console.warn("Session check failed:", err.message);
        if (!cancelled) {
          logout();
          setUser(null);
          setToken(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    boot();
    return () => { cancelled = true; };
  }, [token]);

  async function login({ dbid, password }) {
    const data = await loginWithDbid({ dbid, password });
    setToken(data.token);
    setUser(data.user);
    if (isValidColors(data.user?.colors)) setTheme(data.user.colors);
    return data;
  }

  function doLogout() {
    logout();
    setUser(null);
    setToken(null);
  }

  const value = useMemo(
    () => ({ user, token, login, logout: doLogout, updateUser, isLoading }),
    [user, token, isLoading, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
