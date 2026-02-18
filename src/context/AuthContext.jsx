import { createContext, useContext, useState, useCallback } from "react";
import { apiLogin, apiRegister } from "../api/mockApi";

const AuthContext = createContext(null);

const SESSION_KEY = "sd_session";

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSession);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = useCallback(async (phone, password) => {
    setLoading(true);
    setError("");
    try {
      const u = await apiLogin(phone, password);
      localStorage.setItem(SESSION_KEY, JSON.stringify(u));
      setUser(u);
      return u;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    setLoading(true);
    setError("");
    try {
      const u = await apiRegister(data);
      localStorage.setItem(SESSION_KEY, JSON.stringify(u));
      setUser(u);
      return u;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(""), []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
