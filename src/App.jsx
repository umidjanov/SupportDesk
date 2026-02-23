import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { ProtectedRoute, GuestRoute } from "./components/layout/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

// Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/home/HomePage";
import SupportDashboard from "./pages/support/SupportDashboard";
import AddRecordPage from "./pages/support/AddRecordPage";
import MyLogsPage from "./pages/support/MyLogsPage";
import CuratorDashboard from "./pages/curator/CuratorDashboard";
import CuratorLogsPage from "./pages/curator/CuratorLogsPage";
import NotificationsPage from "./pages/curator/NotificationsPage";
import { CuratorGroups } from "./pages/curator/CuratorGroups";
import { SupportGroups } from "./pages/support/SupportGroups";
import { CuratorSupports } from "./pages/curator/CuratorSupports";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: "'DM Sans', sans-serif",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                boxShadow: "0 4px 24px rgba(61,94,255,.12)",
              },
              success: { iconTheme: { primary: "#059669", secondary: "#fff" } },
              error: { iconTheme: { primary: "#f43f5e", secondary: "#fff" } },
            }}
          />

          <Routes>
            {/* Guest routes (redirect if logged in) */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Protected routes with sidebar layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                {/* Shared */}
                <Route path="/home" element={<HomePage />} />

                {/* Support only */}
                <Route element={<ProtectedRoute allowedRoles={["support"]} />}>
                  <Route path="/dashboard" element={<SupportDashboard />} />
                  <Route path="/dashboard/add" element={<AddRecordPage />} />
                  <Route path="/dashboard/logs" element={<MyLogsPage />} />
                  <Route path="/dashboard/groups" element={<SupportGroups />} />
                </Route>

                {/* Curator only */}
                <Route element={<ProtectedRoute allowedRoles={["curator"]} />}>
                  <Route path="/curator" element={<CuratorDashboard />} />
                  <Route path="/curator/logs" element={<CuratorLogsPage />} />
                  <Route path="/curator/groups" element={<CuratorGroups />} />
                  <Route path="/curator/supports" element={<CuratorSupports />} />
                  <Route
                    path="/curator/notifs"
                    element={<NotificationsPage />}
                  />
                </Route>
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
