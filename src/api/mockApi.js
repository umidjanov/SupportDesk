import { v4 as uuidv4 } from "uuid";

/* ─── SEED USERS ──────────────────────────────────────────────────────────── */
export const SEED_USERS = [
  {
    id: "u1", name: "Fayzulloh Umidjonov",   phone: "974646162",
    password: "Fayzulloh",    role: "support", avatar: "AK", color: "#3d5eff",
    joinDate: "01.01.2026",
  },
  {
    id: "u2", name: "Bobur Toshmatov",  phone: "93-222-22-22",
    password: "Bobur",    role: "support", avatar: "BT", color: "#059669",
    joinDate: "01.01.2026",
  },
  {
    id: "u3", name: "Charos Umarova",   phone: "93-333-33-33",
    password: "Charos",   role: "support", avatar: "CU", color: "#d97706",
    joinDate: "01.01.2026",
  },
  {
    id: "u4", name: "Davron Yusupov",   phone: "93-444-44-44",
    password: "Davron",   role: "support", avatar: "DY", color: "#7c3aed",
    joinDate: "01.01.2026",
  },
  {
    id: "u5", name: "Ezgulik Nazarova", phone: "93-555-55-55",
    password: "Ezgulik",  role: "support", avatar: "EN", color: "#db2777",
    joinDate: "01.01.2026",
  },
  {
    id: "curator", name: "Kurator Admin", phone: "90-000-00-00",
    password: "Kurator123", role: "curator", avatar: "KA", color: "#0891b2",
    joinDate: "01.01.2026",
  },
];

export const MENTORS  = ["Nozila Yusupova","Jasur Rahimov","Kamola Mirzayeva","Sherzod Tursunov","Malika Hasanova","Dilnoza Qodirov"];
export const GROUPS   = ["GW112","GW113","GW114","GW115","GW116","GW117","GW118","GW119","GW120"];
export const STATUSES = ["coworking", "group"];
export const THEMES   = ["JS homework","React basics","CSS Grid","DOM events","Node.js intro","Express routes","Array methods","Async/Await","TypeScript","Git basics"];

/* ─── SEED RECORDS ────────────────────────────────────────────────────────── */
const SEED_RECORDS = [
  { id:"r1", supportId:"u1", supportName:"Aziza Karimova",   date:"17.02.2026", time:"10:00", group:"GW112", mentor:"Nozila Yusupova",  student:"Mahliyo Xudoyberdiyeva", theme:"JS homework",    status:"coworking", createdAt: Date.now()-86400000*2 },
  { id:"r2", supportId:"u2", supportName:"Bobur Toshmatov",  date:"17.02.2026", time:"11:30", group:"GW113", mentor:"Jasur Rahimov",    student:"Sardor Alijonov",        theme:"React basics",   status:"group",     createdAt: Date.now()-86400000*2 },
  { id:"r3", supportId:"u3", supportName:"Charos Umarova",   date:"18.02.2026", time:"14:00", group:"GW114", mentor:"Kamola Mirzayeva", student:"Nilufar Rahimova",       theme:"CSS Grid",       status:"coworking", createdAt: Date.now()-86400000 },
  { id:"r4", supportId:"u1", supportName:"Aziza Karimova",   date:"18.02.2026", time:"09:00", group:"GW112", mentor:"Nozila Yusupova",  student:"Bekzod Tursunov",        theme:"DOM events",     status:"coworking", createdAt: Date.now()-86400000 },
  { id:"r5", supportId:"u4", supportName:"Davron Yusupov",   date:"19.02.2026", time:"13:00", group:"GW115", mentor:"Sherzod Tursunov", student:"Zulfiya Qodirov",        theme:"Node.js intro",  status:"group",     createdAt: Date.now()-3600000  },
  { id:"r6", supportId:"u5", supportName:"Ezgulik Nazarova", date:"19.02.2026", time:"15:30", group:"GW116", mentor:"Malika Hasanova",  student:"Humoyun Baxtiyorov",     theme:"Express routes", status:"coworking", createdAt: Date.now()-1800000  },
  { id:"r7", supportId:"u2", supportName:"Bobur Toshmatov",  date:"19.02.2026", time:"16:00", group:"GW113", mentor:"Jasur Rahimov",    student:"Kamola Umarova",         theme:"Array methods",  status:"coworking", createdAt: Date.now()-900000   },
];

/* ─── STORAGE HELPERS ─────────────────────────────────────────────────────── */
const LS_USERS   = "sd_users";
const LS_RECORDS = "sd_records";
const LS_NOTIFS  = "sd_notifs";

function initStorage() {
  if (!localStorage.getItem(LS_USERS))   localStorage.setItem(LS_USERS,   JSON.stringify(SEED_USERS));
  if (!localStorage.getItem(LS_RECORDS)) localStorage.setItem(LS_RECORDS, JSON.stringify(SEED_RECORDS));
  if (!localStorage.getItem(LS_NOTIFS))  localStorage.setItem(LS_NOTIFS,  JSON.stringify([]));
}

function getUsers()   { return JSON.parse(localStorage.getItem(LS_USERS)   || "[]"); }
function getRecords() { return JSON.parse(localStorage.getItem(LS_RECORDS) || "[]"); }
function getNotifs()  { return JSON.parse(localStorage.getItem(LS_NOTIFS)  || "[]"); }

function saveRecords(r) { localStorage.setItem(LS_RECORDS, JSON.stringify(r)); }
function saveNotifs(n)  { localStorage.setItem(LS_NOTIFS, JSON.stringify(n)); }
function saveUsers(u)   { localStorage.setItem(LS_USERS, JSON.stringify(u)); }

initStorage();

/* ─── API ─────────────────────────────────────────────────────────────────── */
const delay = (ms = 200) => new Promise(r => setTimeout(r, ms));

// Auth
export async function apiLogin(phone, password) {
  await delay(400);
  const user = getUsers().find(u => u.phone === phone && u.password === password);
  if (!user) throw new Error("Telefon yoki parol noto'g'ri!");
  const { password: _, ...safe } = user;
  return safe;
}

export async function apiRegister(data) {
  await delay(400);
  const users = getUsers();
  if (users.find(u => u.phone === data.phone)) throw new Error("Bu telefon raqam allaqachon ro'yxatdan o'tgan!");
  const newUser = {
    id:       uuidv4(),
    name:     data.name,
    phone:    data.phone,
    password: data.password,
    role:     "support",
    avatar:   data.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(),
    color:    ["#3d5eff","#059669","#d97706","#7c3aed","#db2777"][Math.floor(Math.random()*5)],
    joinDate: new Date().toLocaleDateString("ru-RU").split(".").join("."),
  };
  saveUsers([...users, newUser]);
  const { password: _, ...safe } = newUser;
  return safe;
}

// Records
export async function apiGetRecords(filter = {}) {
  await delay(150);
  let records = getRecords();
  if (filter.supportId) records = records.filter(r => r.supportId === filter.supportId);
  if (filter.date)      records = records.filter(r => r.date === filter.date);
  if (filter.group)     records = records.filter(r => r.group === filter.group);
  if (filter.search) {
    const q = filter.search.toLowerCase();
    records = records.filter(r => `${r.student}${r.mentor}${r.theme}${r.group}`.toLowerCase().includes(q));
  }
  return records.sort((a, b) => b.createdAt - a.createdAt);
}

export async function apiAddRecord(data, user) {
  await delay(300);
  const record = {
    id:          uuidv4(),
    supportId:   user.id,
    supportName: user.name,
    createdAt:   Date.now(),
    ...data,
  };
  saveRecords([...getRecords(), record]);

  // Push notification
  const notif = {
    id:          uuidv4(),
    type:        "new_record",
    supportId:   user.id,
    supportName: user.name,
    student:     data.student,
    group:       data.group,
    theme:       data.theme,
    recordId:    record.id,
    createdAt:   Date.now(),
    seen:        false,
  };
  saveNotifs([...getNotifs(), notif]);

  return record;
}

export async function apiUpdateRecord(id, data, userId) {
  await delay(250);
  const records = getRecords();
  const idx = records.findIndex(r => r.id === id);
  if (idx === -1) throw new Error("Yozuv topilmadi!");
  if (records[idx].supportId !== userId) throw new Error("Ruxsat yo'q!");
  records[idx] = { ...records[idx], ...data };
  saveRecords(records);
  return records[idx];
}

export async function apiDeleteRecord(id, userId) {
  await delay(200);
  const records = getRecords();
  const target = records.find(r => r.id === id);
  if (!target)                        throw new Error("Yozuv topilmadi!");
  if (target.supportId !== userId)    throw new Error("Ruxsat yo'q!");
  saveRecords(records.filter(r => r.id !== id));
  return true;
}

// Notifications
export async function apiGetNotifs() {
  await delay(100);
  return getNotifs().sort((a,b) => b.createdAt - a.createdAt);
}

export async function apiMarkNotifsSeen() {
  await delay(100);
  const notifs = getNotifs().map(n => ({ ...n, seen: true }));
  saveNotifs(notifs);
  return notifs;
}

// Users (for curator / home)
export async function apiGetSupportUsers() {
  await delay(100);
  return getUsers()
    .filter(u => u.role === "support")
    .map(({ password: _, ...u }) => u);
}
