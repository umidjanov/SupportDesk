import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="main-content flex-1">
        <div className="page-container w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
