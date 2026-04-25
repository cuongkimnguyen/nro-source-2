import { useEffect, useState } from 'react';
import client from '../api/client.js';

function fmtDate(d) { return d ? new Date(d).toLocaleString('vi-VN') : '—'; }

export default function AuditLog() {
  const [page, setPage]     = useState(1);
  const [admin, setAdmin]   = useState('');
  const [action, setAction] = useState('');
  const [query, setQuery]   = useState({ admin: '', action: '' });
  const [data, setData]     = useState(null);
  const [error, setError]   = useState('');
  const LIMIT = 30;

  useEffect(() => {
    setData(null);
    client.get('/audit-log', { params: { page, limit: LIMIT, admin: query.admin, action: query.action } })
      .then((r) => setData(r.data))
      .catch((e) => setError(e.response?.data?.error ?? 'Error'));
  }, [page, query]);

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    setQuery({ admin: admin.trim(), action: action.trim() });
  }

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 1;

  return (
    <>
      <div className="page-header">
        <h1>Admin Audit Log</h1>
        <p>All administrative actions with before/after state</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input className="input" style={{ maxWidth: 180 }} placeholder="Admin username" value={admin} onChange={(e) => setAdmin(e.target.value)} />
        <input className="input" style={{ maxWidth: 180 }} placeholder="Action keyword" value={action} onChange={(e) => setAction(e.target.value)} />
        <button className="btn btn-primary" type="submit">Filter</button>
        <button className="btn btn-secondary" type="button" onClick={() => { setAdmin(''); setAction(''); setQuery({ admin: '', action: '' }); setPage(1); }}>Clear</button>
      </form>

      {data && <p className="text-muted text-sm" style={{ marginBottom: 10 }}>{data.total.toLocaleString()} entries</p>}

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Admin</th>
                <th>Action</th>
                <th>Target</th>
                <th>Before</th>
                <th>After</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {!data && <tr><td colSpan={7} className="text-muted">Loading…</td></tr>}
              {data?.data.length === 0 && <tr><td colSpan={7} className="text-muted">No entries.</td></tr>}
              {data?.data.map((row) => (
                <tr key={row.id}>
                  <td className="text-muted text-sm" style={{ whiteSpace: 'nowrap' }}>{fmtDate(row.created_at)}</td>
                  <td>{row.admin_username}</td>
                  <td><span className="badge badge-blue">{row.action}</span></td>
                  <td className="text-muted text-sm">{row.target_type} {row.target_id}</td>
                  <td className="text-muted text-sm" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <code>{row.before_payload ? JSON.stringify(JSON.parse(row.before_payload)) : '—'}</code>
                  </td>
                  <td className="text-muted text-sm" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <code>{row.after_payload ? JSON.stringify(JSON.parse(row.after_payload)) : '—'}</code>
                  </td>
                  <td className="text-muted text-sm">{row.ip_address ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
            <span className="text-muted text-sm">Page {page} / {totalPages}</span>
            <button className="btn btn-secondary btn-sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
          </div>
        )}
      </div>
    </>
  );
}
