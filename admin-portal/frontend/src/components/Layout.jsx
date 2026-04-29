import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import client from '../api/client.js';

const navItems = [
  { to: '/dashboard', label: '⊞  Dashboard' },
  { to: '/players',   label: '👤  Players' },
  { to: '/giftcodes', label: '🎁  Gift Codes' },
  { to: '/payments',  label: '💳  Payments' },
  { to: '/server',    label: '🖥  Server' },
  { to: '/audit-log', label: '📋  Audit Log' },
  { to: '/buff-log',  label: '🛡  Buff Log' },
];

export default function Layout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('nro_admin_user') || '{}');

  async function handleLogout() {
    try { await client.post('/auth/logout'); } catch { /* ignore */ }
    localStorage.removeItem('nro_admin_token');
    localStorage.removeItem('nro_admin_user');
    navigate('/login');
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          🐉 NRO Admin
        </div>
        <nav className="sidebar-nav">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div style={{ marginBottom: 8 }}>
            👤 <strong>{user.username}</strong>
            <span className="text-muted" style={{ marginLeft: 6 }}>
              {user.role === 2 ? '(superadmin)' : '(admin)'}
            </span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout} style={{ width: '100%' }}>
            Logout
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
