import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "curator" ? "/curator" : "/dashboard"} replace />;
  }

  return <Outlet />;
}

export function GuestRoute() {
  const { user } = useAuth();
  if (!user) return <Outlet />;
  return <Navigate to={user.role === "curator" ? "/curator" : "/dashboard"} replace />;
}
