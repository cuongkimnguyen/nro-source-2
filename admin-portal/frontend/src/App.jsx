import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import GameGuide from './pages/GameGuide.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Players from './pages/Players.jsx';
import PlayerDetail from './pages/PlayerDetail.jsx';
import GiftCodes from './pages/GiftCodes.jsx';
import ServerStatus from './pages/ServerStatus.jsx';
import AuditLog from './pages/AuditLog.jsx';
import Payments from './pages/Payments.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/game-guide"  element={<GameGuide />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"          element={<Dashboard />} />
            <Route path="/players"            element={<Players />} />
            <Route path="/players/:id"        element={<PlayerDetail />} />
            <Route path="/giftcodes"          element={<GiftCodes />} />
            <Route path="/server"             element={<ServerStatus />} />
            <Route path="/payments"           element={<Payments />} />
            <Route path="/audit-log"          element={<AuditLog />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
