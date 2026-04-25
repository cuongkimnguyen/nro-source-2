import { useEffect, useState } from 'react';
import client from '../api/client.js';

function fmtNum(n) { return Number(n ?? 0).toLocaleString(); }
function fmtDate(d) { return d ? new Date(d).toLocaleString('vi-VN') : '—'; }

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get('/dashboard')
      .then((r) => setData(r.data))
      .catch((e) => setError(e.response?.data?.error ?? 'Failed to load dashboard'));
  }, []);

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!data)  return <div className="text-muted">Loading…</div>;

  const serverBadge = data.server?.trangthai === 'hoatdong'
    ? <span className="badge badge-green">Online</span>
    : <span className="badge badge-red">Maintenance</span>;

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Server: <strong>{data.server?.tenmaychu ?? '—'}</strong> {serverBadge}</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="label">Total Accounts</div>
          <div className="value">{fmtNum(data.totalAccounts)}</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Players</div>
          <div className="value">{fmtNum(data.totalPlayers)}</div>
        </div>
        <div className="stat-card">
          <div className="label">Online Now</div>
          <div className="value success">{fmtNum(data.onlinePlayers)}</div>
        </div>
        <div className="stat-card">
          <div className="label">Banned</div>
          <div className="value accent">{fmtNum(data.bannedAccounts)}</div>
        </div>
        <div className="stat-card">
          <div className="label">Revenue (credited)</div>
          <div className="value success">{fmtNum(data.totalPayments)} đ</div>
        </div>
        <div className="stat-card">
          <div className="label">Pending Payments</div>
          <div className="value warning">{fmtNum(data.pendingPayments)}</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Recent Admin Actions</h2>
        {data.recentAudit?.length === 0
          ? <p className="text-muted">No actions yet.</p>
          : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Admin</th>
                    <th>Action</th>
                    <th>Target</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentAudit.map((row) => (
                    <tr key={row.id ?? row.created_at}>
                      <td>{row.admin_username}</td>
                      <td><span className="badge badge-blue">{row.action}</span></td>
                      <td className="text-muted">{row.target_type} {row.target_id}</td>
                      <td className="text-muted text-sm">{fmtDate(row.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </>
  );
}
