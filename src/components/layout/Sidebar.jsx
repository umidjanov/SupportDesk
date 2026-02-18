import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Avatar } from "../ui";

const SUPPORT_NAV = [
  { to: "/dashboard",       icon: "⊞", label: "Dashboard" },
  { to: "/dashboard/add",   icon: "＋", label: "Yangi yozuv" },
  { to: "/dashboard/logs",  icon: "☰", label: "Mening yozuvlarim" },
];

const CURATOR_NAV = [
  { to: "/curator",         icon: "⊞", label: "Umumiy panel" },
  { to: "/curator/logs",    icon: "☰", label: "Barcha yozuvlar" },
  { to: "/curator/notifs",  icon: "🔔", label: "Bildirishnomalar" },
];

const COMMON_NAV = [
  { to: "/home",            icon: "🏠", label: "Bosh sahifa" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { unseenCount }  = useData();
  const navigate         = useNavigate();

  if (!user) return null;

  const navItems = user.role === "curator" ? CURATOR_NAV : SUPPORT_NAV;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="px-6 py-5 mb-2" style={{ borderBottom: "1px solid rgba(255,255,255,.08)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-black text-white text-lg"
            style={{ background: "linear-gradient(135deg,#3d5eff,#6488ff)", boxShadow: "0 0 20px rgba(61,94,255,.5)" }}
          >
            S
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm leading-tight">SupportDesk</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,.35)" }}>v1.0</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {/* Common */}
        <div className="mb-2">
          <p className="px-7 mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,.25)" }}>
            Asosiy
          </p>
          {COMMON_NAV.map(item => (
            <NavLink
              key={item.to} to={item.to}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? "active" : ""}`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Role-specific */}
        <div className="mt-4">
          <p className="px-7 mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,.25)" }}>
            {user.role === "curator" ? "Kurator" : "Support"}
          </p>
          {navItems.map(item => (
            <NavLink
              key={item.to} to={item.to}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? "active" : ""}`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span>{item.label}</span>
              {item.to.includes("notifs") && unseenCount > 0 && (
                <span
                  className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "#f43f5e", color: "#fff" }}
                >
                  {unseenCount}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User footer */}
      <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}>
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl" style={{ background: "rgba(255,255,255,.05)" }}>
          <Avatar initials={user.avatar} color={user.color} size={36} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs truncate" style={{ color: "rgba(255,255,255,.35)" }}>
              {user.role === "curator" ? "Kurator" : "Support"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Chiqish"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-fast hover:bg-red-500/20 cursor-pointer text-lg"
            style={{ color: "rgba(255,255,255,.35)" }}
          >
            ⇥
          </button>
        </div>
      </div>
    </aside>
  );
}
