import { cn } from "../../utils/helpers";

/* ── Avatar ─────────────────────────────────────────────────────────────── */
export function Avatar({ initials, color, size = 40, className = "" }) {
  return (
    <div
      className={cn("flex items-center justify-center rounded-xl font-bold select-none shrink-0 font-display", className)}
      style={{
        width: size, height: size, fontSize: size * 0.34,
        background: `linear-gradient(135deg, ${color}dd, ${color}88)`,
        color: "#fff",
        boxShadow: `0 2px 8px ${color}44`,
      }}
    >
      {initials}
    </div>
  );
}

/* ── Badge ──────────────────────────────────────────────────────────────── */
export function Badge({ children, variant = "blue", className = "" }) {
  return <span className={cn("badge", `badge-${variant}`, className)}>{children}</span>;
}

/* ── Button ─────────────────────────────────────────────────────────────── */
export function Button({
  children, variant = "primary", size = "md",
  onClick, disabled, loading, className = "", type = "button",
}) {
  const sizeClass = size === "sm" ? "btn-sm" : "";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn("btn", `btn-${variant}`, sizeClass, disabled || loading ? "opacity-60 cursor-not-allowed" : "", className)}
    >
      {loading && <Spinner size={14} />}
      {children}
    </button>
  );
}

/* ── Spinner ────────────────────────────────────────────────────────────── */
export function Spinner({ size = 20, color = "#3d5eff" }) {
  return (
    <div
      style={{
        width: size, height: size,
        border: `2px solid ${color}22`,
        borderTopColor: color,
        borderRadius: "50%",
        animation: "spin .6s linear infinite",
      }}
    />
  );
}

/* ── Card ───────────────────────────────────────────────────────────────── */
export function Card({ children, className = "", padding = "p-6" }) {
  return <div className={cn("card", padding, className)}>{children}</div>;
}

/* ── Input ──────────────────────────────────────────────────────────────── */
export function Input({ label, error, icon, hint, className = "", ...props }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none" style={{ color: "var(--text-3)" }}>
            {icon}
          </span>
        )}
        <input
          {...props}
          className={cn("input-field", icon ? "pl-10" : "", error ? "!border-red-400 !ring-red-100" : "")}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs" style={{ color: "var(--text-3)" }}>{hint}</p>}
    </div>
  );
}

/* ── Select ─────────────────────────────────────────────────────────────── */
export function Select({ label, options, placeholder, error, className = "", ...props }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
          {label}
        </label>
      )}
      <select {...props} className={cn("input-field", error ? "!border-red-400" : "")}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt =>
          typeof opt === "string"
            ? <option key={opt} value={opt}>{opt}</option>
            : <option key={opt.value} value={opt.value}>{opt.label}</option>
        )}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ── Modal ──────────────────────────────────────────────────────────────── */
export function Modal({ open, onClose, title, children, width = "max-w-lg" }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,22,41,0.55)", backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className={cn("w-full rounded-2xl shadow-2xl animate-pop", width)}
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h3 className="font-display font-bold text-lg" style={{ color: "var(--text-1)" }}>{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-fast hover:bg-gray-100 cursor-pointer"
            style={{ color: "var(--text-3)" }}
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/* ── Empty State ────────────────────────────────────────────────────────── */
export function EmptyState({ icon = "📋", title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
        style={{ background: "var(--bg-2)" }}
      >
        {icon}
      </div>
      <p className="font-semibold text-base" style={{ color: "var(--text-2)" }}>{title}</p>
      {desc && <p className="text-sm mt-1.5" style={{ color: "var(--text-3)" }}>{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ── Confirm Dialog ─────────────────────────────────────────────────────── */
export function ConfirmDialog({ open, onClose, onConfirm, title, message, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} width="max-w-sm">
      <p className="text-sm mb-6" style={{ color: "var(--text-2)" }}>{message}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={onClose}>Bekor qilish</Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          Ha, o'chirish
        </Button>
      </div>
    </Modal>
  );
}

/* ── Page Header ────────────────────────────────────────────────────────── */
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-7 animate-fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl" style={{ color: "var(--text-1)" }}>{title}</h1>
        {subtitle && <p className="text-sm mt-1" style={{ color: "var(--text-3)" }}>{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ── Stat Card ──────────────────────────────────────────────────────────── */
export function StatCard({ icon, label, value, sub, color = "#3d5eff", delay = 0 }) {
  return (
    <div
      className="stat-card card animate-fade-up"
      style={{ animationDelay: `${delay}ms`, "--tw-shadow": "none" }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
        style={{ background: `${color}15` }}
      >
        {icon}
      </div>
      <p className="text-3xl font-display font-bold" style={{ color }}>{value}</p>
      <p className="text-sm font-medium mt-1" style={{ color: "var(--text-2)" }}>{label}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{sub}</p>}
    </div>
  );
}

/* ── Loading Skeleton ───────────────────────────────────────────────────── */
export function Skeleton({ className = "" }) {
  return (
    <div
      className={cn("rounded-lg", className)}
      style={{
        background: "linear-gradient(90deg, #f0f4ff 25%, #e4eaff 50%, #f0f4ff 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
      }}
    />
  );
}

/* ── CSS for spin ───────────────────────────────────────────────────────── */
const spinStyle = document.createElement("style");
spinStyle.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(spinStyle);
