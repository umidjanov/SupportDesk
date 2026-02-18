# 🎓 SupportDesk — Teacher Management System

## 📁 Project Structure

```
supportdesk/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx                       ← Entry point
    ├── App.jsx                        ← Router + all routes
    ├── index.css                      ← Global styles, CSS variables
    │
    ├── api/
    │   └── mockApi.js                 ← Mock API (LocalStorage persistence)
    │
    ├── context/
    │   ├── AuthContext.jsx            ← Authentication state
    │   └── DataContext.jsx            ← Records + Notifications state
    │
    ├── utils/
    │   └── helpers.js                 ← Date, time, formatting utilities
    │
    ├── components/
    │   ├── ui/
    │   │   └── index.jsx              ← Avatar, Button, Card, Input, Modal, Badge...
    │   ├── layout/
    │   │   ├── AppLayout.jsx          ← Sidebar + main content wrapper
    │   │   ├── Sidebar.jsx            ← Navigation sidebar
    │   │   └── ProtectedRoute.jsx     ← Role-based route guard
    │   ├── forms/
    │   │   └── StudentForm.jsx        ← Add/Edit student record form
    │   └── tables/
    │       └── RecordsTable.jsx       ← Reusable records table
    │
    └── pages/
        ├── auth/
        │   ├── LoginPage.jsx          ← Login with demo credentials
        │   └── RegisterPage.jsx       ← Register as support teacher
        ├── home/
        │   └── HomePage.jsx           ← Overview for all roles
        ├── support/
        │   ├── SupportDashboard.jsx   ← Support main dashboard
        │   ├── AddRecordPage.jsx      ← Add new student log
        │   └── MyLogsPage.jsx         ← View/Edit/Delete own logs
        └── curator/
            ├── CuratorDashboard.jsx   ← Curator overview + stats
            ├── CuratorLogsPage.jsx    ← All logs with filters
            └── NotificationsPage.jsx  ← Real-time notification feed
```

## 🚀 Quick Start

```bash
cd supportdesk
npm install
npm run dev
```

Open: `http://localhost:5173`

## 🔐 Demo Credentials

| Role | Name | Phone | Password |
|------|------|-------|----------|
| Support | Aziza Karimova | 93-111-11-11 | Aziza |
| Support | Bobur Toshmatov | 93-222-22-22 | Bobur |
| Support | Charos Umarova | 93-333-33-33 | Charos |
| Support | Davron Yusupov | 93-444-44-44 | Davron |
| Support | Ezgulik Nazarova | 93-555-55-55 | Ezgulik |
| **Curator** | **Kurator Admin** | **90-000-00-00** | **Kurator123** |

## ✅ Features Implemented

### Auth System
- [x] Login + Register pages
- [x] Role-based auth (support / curator)
- [x] Session persistence in LocalStorage
- [x] Protected routes with role guards
- [x] Auto-redirect based on role

### Support Teacher
- [x] Personal dashboard with stats
- [x] Add new student log (DATE, TIME, GROUP, MENTOR, STUDENT, THEME, STATUS)
- [x] View own submitted logs
- [x] Edit own logs (modal form)
- [x] Delete own logs (confirm dialog)
- [x] Cannot access other supports' data
- [x] Daily/weekly/total counters

### Curator
- [x] All supports' logs in one view
- [x] Notification system (new log = new notification)
- [x] Mark all notifications as seen
- [x] Filter by support teacher, date, group, search
- [x] Leaderboard + top themes chart
- [x] Overview statistics

### Home Page
- [x] All support teachers list with activity
- [x] Recent records feed
- [x] Overall statistics

## 🏗️ Tech Stack

- **React 18** + JSX
- **React Router v6** — navigation + protected routes
- **Context API** — Auth + Data state management
- **Tailwind CSS** — utility-first styling
- **react-hot-toast** — notifications
- **uuid** — unique IDs
- **LocalStorage** — data persistence (mock API)
- **Vite** — build tool

## 🔄 Data Persistence

All data is stored in LocalStorage under these keys:
- `sd_users` — user accounts
- `sd_records` — student logs
- `sd_notifs` — curator notifications
- `sd_session` — current user session

To reset all data: open DevTools → Application → LocalStorage → Clear all
