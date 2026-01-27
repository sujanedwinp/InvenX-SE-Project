import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchMe, getStoredUser, loginWithDbid, logout } from "../services/auth";
import { useTheme } from "./ThemeContext";

const AuthContext = createContext({
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  isLoading: true
});

export function AuthProvider({ children }) {
  const { setTheme } = useTheme();

  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(localStorage.getItem("invenx_token"));
  const [isLoading, setIsLoading] = useState(true);

  // On boot, if we have a token, refresh the current user (and theme)
  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        if (!token) return;
        const me = await fetchMe();
        if (cancelled) return;
        if (me) {
          setUser(me);
          if (me.colors) setTheme(me.colors);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, [setTheme, token]);

  async function login({ dbid, password }) {
    const data = await loginWithDbid({ dbid, password });
    setToken(data.token);
    setUser(data.user);

    // Fetch user colors on login (requirement) and apply theme
    if (data.user?.colors) setTheme(data.user.colors);

    return data;
  }

  function doLogout() {
    logout();
    setUser(null);
    setToken(null);
  }

  const value = useMemo(
    () => ({ user, token, login, logout: doLogout, isLoading }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

