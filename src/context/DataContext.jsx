import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  apiGetRecords,
  apiAddRecord,
  apiUpdateRecord,
  apiDeleteRecord,
  apiGetNotifs,
  apiMarkNotifsSeen,
  apiGetSupportUsers,
} from "../api/mockApi";
import { useAuth } from "./AuthContext";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user } = useAuth();

  const [records, setRecords] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [supportUsers, setSupportUsers] = useState([]);
  const [loadingRec, setLoadingRec] = useState(false);
  const [loadingNotif, setLoadingNotif] = useState(false);

  // ── Fetch records ────────────────────────────────────────────────────────
  const fetchRecords = useCallback(
    async (filter = {}) => {
      if (!user) return;
      setLoadingRec(true);
      try {
        const f =
          user.role === "support" ? { ...filter, supportId: user.id } : filter;
        const data = await apiGetRecords(f);
        setRecords(data);
      } finally {
        setLoadingRec(false);
      }
    },
    [user],
  );

  // ── Fetch notifs (curator only) ──────────────────────────────────────────
  const fetchNotifs = useCallback(async () => {
    if (!user || user.role !== "curator") return;
    setLoadingNotif(true);
    try {
      const data = await apiGetNotifs();
      setNotifs(data);
    } finally {
      setLoadingNotif(false);
    }
  }, [user]);

  // ── Fetch support users ──────────────────────────────────────────────────
  const fetchSupportUsers = useCallback(async () => {
    const data = await apiGetSupportUsers();
    setSupportUsers(data);
  }, []);

  // ── Add ──────────────────────────────────────────────────────────────────
  const addRecord = useCallback(
    async (data) => {
      const rec = await apiAddRecord(data, user);
      setRecords((prev) => [rec, ...prev]);
      return rec;
    },
    [user],
  );

  // ── Update ───────────────────────────────────────────────────────────────
  const updateRecord = useCallback(
    async (id, data) => {
      const updated = await apiUpdateRecord(id, data, user.id);
      setRecords((prev) => prev.map((r) => (r.id === id ? updated : r)));
      return updated;
    },
    [user],
  );

  // ── Delete ───────────────────────────────────────────────────────────────
  const deleteRecord = useCallback(
    async (id) => {
      await apiDeleteRecord(id, user.id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    },
    [user],
  );

  // ── Mark notifs seen ─────────────────────────────────────────────────────
  const markAllSeen = useCallback(async () => {
    const updated = await apiMarkNotifsSeen();
    setNotifs(updated);
  }, []);

  const unseenCount = notifs.filter((n) => !n.seen).length;

  // ── Init ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (user) {
      fetchRecords();
      fetchNotifs();
      fetchSupportUsers();
    } else {
      setRecords([]);
      setNotifs([]);
    }
  }, [user, fetchRecords, fetchNotifs, fetchSupportUsers]);

  return (
    <DataContext.Provider
      value={{
        records,
        loadingRec,
        fetchRecords,
        notifs,
        unseenCount,
        loadingNotif,
        fetchNotifs,
        markAllSeen,
        supportUsers,
        fetchSupportUsers,
        addRecord,
        updateRecord,
        deleteRecord,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be inside DataProvider");
  return ctx;
}
