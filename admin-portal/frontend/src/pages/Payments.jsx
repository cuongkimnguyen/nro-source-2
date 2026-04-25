import { useEffect, useState } from 'react';
import client from '../api/client.js';

function fmtDate(d) { return d ? new Date(d).toLocaleString('vi-VN') : '—'; }
function fmtNum(n)  { return Number(n ?? 0).toLocaleString(); }

export default function Payments() {
  const [search, setSearch] = useState('');
  const [query, setQuery]   = useState('');
  const [page, setPage]     = useState(1);
  const [data, setData]     = useState(null);
  const [error, setError]   = useState('');
  const LIMIT = 20;

  useEffect(() => {
    setData(null);
    client.get('/payments', { params: { search: query, page, limit: LIMIT } })
      .then((r) => setData(r.data))
      .catch((e) => setError(e.response?.data?.error ?? 'Error'));
  }, [query, page]);

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    setQuery(search.trim());
  }

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 1;

  return (
    <>
      <div className="page-header">
        <h1>Payments</h1>
        <p>Card top-up history</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSearch} className="search-bar">
        <input className="input" placeholder="Search username, refNo, or telco…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-primary" type="submit">Search</button>
        {query && (
          <button className="btn btn-secondary" type="button" onClick={() => { setQuery(''); setSearch(''); setPage(1); }}>Clear</button>
        )}
      </form>

      {data && <p className="text-muted text-sm" style={{ marginBottom: 10 }}>{data.total.toLocaleString()} records</p>}

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ref</th>
                <th>User</th>
                <th>Date</th>
                <th>Telco</th>
                <th>Declared</th>
                <th>Credited</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {!data && <tr><td colSpan={7} className="text-muted">Loading…</td></tr>}
              {data?.data.length === 0 && <tr><td colSpan={7} className="text-muted">No records.</td></tr>}
              {data?.data.map((p) => (
                <tr key={p.id}>
                  <td className="text-muted text-sm">{p.refNo}</td>
                  <td>{p.name}</td>
                  <td className="text-muted text-sm">{fmtDate(p.date)}</td>
                  <td>{p.card_telco ?? '—'}</td>
                  <td>{fmtNum(p.declared_amount)} đ</td>
                  <td>{fmtNum(p.final_credited_amount)} đ</td>
                  <td>
                    {p.is_credited
                      ? <span className="badge badge-green">Credited</span>
                      : p.api_status_code === '99'
                        ? <span className="badge badge-yellow">Pending</span>
                        : <span className="badge badge-red">{p.status_text}</span>}
                  </td>
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
