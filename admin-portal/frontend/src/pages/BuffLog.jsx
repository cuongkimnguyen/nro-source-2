import { useEffect, useState } from 'react';
import client from '../api/client.js';

function fmtDate(d) { return d ? new Date(d).toLocaleString('vi-VN') : '—'; }

function parseOptions(json) {
  try {
    if (!json || json === '[]') return '—';
    const arr = JSON.parse(json);
    return arr.map((o) => `${o.name ?? o.id}=${o.value ?? o.param}`).join(', ');
  } catch {
    return json;
  }
}

const COMMAND_COLORS = {
  i:       'badge-blue',
  give:    'badge-green',
  getitem: 'badge-green',
  b:       'badge-yellow',
  dm:      'badge-red',
  hp:      'badge-red',
  ki:      'badge-red',
  up:      'badge-red',
  upp:     'badge-red',
};

function CommandBadge({ cmd }) {
  const cls = COMMAND_COLORS[cmd] ?? 'badge-blue';
  return <span className={`badge ${cls}`}>{cmd}</span>;
}

export default function BuffLog() {
  const [page, setPage]       = useState(1);
  const [admin, setAdmin]     = useState('');
  const [target, setTarget]   = useState('');
  const [command, setCommand] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo]   = useState('');
  const [query, setQuery]     = useState({});
  const [data, setData]       = useState(null);
  const [error, setError]     = useState('');
  const LIMIT = 30;

  useEffect(() => {
    setData(null);
    client.get('/buff-log', { params: { page, limit: LIMIT, ...query } })
      .then((r) => setData(r.data))
      .catch((e) => setError(e.response?.data?.error ?? 'Error'));
  }, [page, query]);

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    setQuery({ admin: admin.trim(), target: target.trim(), command: command.trim(), dateFrom, dateTo });
  }

  function handleClear() {
    setAdmin(''); setTarget(''); setCommand(''); setDateFrom(''); setDateTo('');
    setQuery({}); setPage(1);
  }

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 1;

  return (
    <>
      <div className="page-header">
        <h1>Admin Buff Log</h1>
        <p>All in-game admin buff commands — item, currency and stat changes</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input className="input" style={{ maxWidth: 160 }} placeholder="Admin name" value={admin} onChange={(e) => setAdmin(e.target.value)} />
        <input className="input" style={{ maxWidth: 160 }} placeholder="Target player" value={target} onChange={(e) => setTarget(e.target.value)} />
        <select className="input" style={{ maxWidth: 120 }} value={command} onChange={(e) => setCommand(e.target.value)}>
          <option value="">All commands</option>
          {['i', 'give', 'getitem', 'b', 'dm', 'hp', 'ki', 'up', 'upp'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input className="input" type="date" style={{ maxWidth: 150 }} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} title="From date" />
        <input className="input" type="date" style={{ maxWidth: 150 }} value={dateTo}   onChange={(e) => setDateTo(e.target.value)}   title="To date" />
        <button className="btn btn-primary" type="submit">Filter</button>
        <button className="btn btn-secondary" type="button" onClick={handleClear}>Clear</button>
      </form>

      {data && <p className="text-muted text-sm" style={{ marginBottom: 10 }}>{data.total.toLocaleString()} entries</p>}

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Admin</th>
                <th>Cmd</th>
                <th>Target</th>
                <th>Item / Stat</th>
                <th style={{ textAlign: 'right' }}>Qty / Value</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {!data && <tr><td colSpan={7} className="text-muted">Loading…</td></tr>}
              {data?.data.length === 0 && <tr><td colSpan={7} className="text-muted">No entries.</td></tr>}
              {data?.data.map((row) => (
                <tr key={row.id}>
                  <td className="text-muted text-sm" style={{ whiteSpace: 'nowrap' }}>{fmtDate(row.created_at)}</td>
                  <td>{row.admin_name}</td>
                  <td><CommandBadge cmd={row.command} /></td>
                  <td>{row.target_player}</td>
                  <td>
                    <span>{row.item_name}</span>
                    {row.item_id >= 0 && <span className="text-muted text-sm" style={{ marginLeft: 4 }}>[{row.item_id}]</span>}
                    {row.item_id === -1 && <span className="text-muted text-sm" style={{ marginLeft: 4 }}>(vàng)</span>}
                    {row.item_id === -2 && <span className="text-muted text-sm" style={{ marginLeft: 4 }}>(ngọc)</span>}
                    {row.item_id === -3 && <span className="text-muted text-sm" style={{ marginLeft: 4 }}>(ngọc khóa)</span>}
                    {row.item_id === -99 && <span className="text-muted text-sm" style={{ marginLeft: 4 }}>(stat)</span>}
                  </td>
                  <td style={{ textAlign: 'right' }}>{row.quantity.toLocaleString()}</td>
                  <td className="text-muted text-sm">{parseOptions(row.options)}</td>
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
