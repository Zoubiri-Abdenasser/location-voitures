import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated, isManager } from "../../api/auth";

const managerOnlyPaths = ["/admin/cars", "/admin/employees"];

export default function ProtectedRoute() {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const isManagerOnlyPath = managerOnlyPaths.some((p) =>
    location.pathname.startsWith(p)
  );

  if (isManagerOnlyPath && !isManager()) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}