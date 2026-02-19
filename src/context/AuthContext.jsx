import { createContext, useContext, useState, useCallback } from "react";
import { apiLogin, apiRegister } from "../api/mockApi";

const AuthContext = createContext(null);

const SESSION_INDEX_KEY = "sd_sess_idx";
function getSessionIndex() {
  try {
    let idx = sessionStorage.getItem(SESSION_INDEX_KEY);
    if (!idx) {
      idx = Math.random().toString(36).slice(2, 10);
      sessionStorage.setItem(SESSION_INDEX_KEY, idx);
    }
    return idx;
  } catch {
    return Math.random().toString(36).slice(2, 10);
  }
}
function getSessionKey() {
  return `sd_session:${getSessionIndex()}`;
}

function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem(getSessionKey()));
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
      // If server returns token, persist it alongside user; else store user only
      const payload = typeof u === 'object' && u !== null ? u : { user: u };
      sessionStorage.setItem(getSessionKey(), JSON.stringify(payload));
      setUser(payload);
      return payload;
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
      const payload = typeof u === 'object' && u !== null ? u : { user: u };
      sessionStorage.setItem(getSessionKey(), JSON.stringify(payload));
      setUser(payload);
      return payload;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    try { sessionStorage.removeItem(getSessionKey()); } catch {}
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
