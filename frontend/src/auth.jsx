import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      setReady(true);
      return;
    }
    api
      .get("/api/auth/me/")
      .then((me) => {
        setUser(me);
        localStorage.setItem("user", JSON.stringify(me));
      })
      .catch(() => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  const login = async (email, password) => {
    const data = await api.post("/api/auth/login/", { email, password });
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    await api.post("/api/auth/register/", payload);
    return login(payload.email, payload.password);
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = useMemo(() => ({ user, ready, login, register, logout }), [user, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
