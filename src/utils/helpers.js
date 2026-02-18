export function formatDate(dateStr) {
  if (!dateStr) return "";
  const [d, m, y] = dateStr.split(".");
  return new Date(`${y}-${m}-${d}`).toLocaleDateString("uz-UZ", { day:"2-digit", month:"short", year:"numeric" });
}

export function todayString() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,"0")}.${String(d.getMonth()+1).padStart(2,"0")}.${d.getFullYear()}`;
}

export function nowTimeString() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

export function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "Hozir";
  if (mins < 60) return `${mins} daqiqa oldin`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs} soat oldin`;
  return `${Math.floor(hrs / 24)} kun oldin`;
}

export function statusColor(status) {
  return status === "coworking" ? "badge-blue" : "badge-green";
}

export function statusLabel(status) {
  return status === "coworking" ? "🏢 Coworking" : "👥 Group";
}

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
