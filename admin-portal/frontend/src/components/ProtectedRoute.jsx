import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('nro_admin_token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
