import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client.js';

function fmtDate(d) { return d ? new Date(d).toLocaleDateString('vi-VN') : '—'; }

export default function Players() {
  const [search, setSearch] = useState('');
  const [query, setQuery]   = useState('');
  const [page, setPage]     = useState(1);
  const [data, setData]     = useState(null);
  const [error, setError]   = useState('');
  const LIMIT = 20;

  useEffect(() => {
    setData(null);
    client.get('/players', { params: { search: query, page, limit: LIMIT } })
      .then((r) => setData(r.data))
      .catch((e) => setError(e.response?.data?.error ?? 'Failed to load players'));
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
        <h1>Player Management</h1>
        <p>Search and manage game accounts</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSearch} className="search-bar">
        <input
          className="input"
          placeholder="Search username, player name, or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">Search</button>
        {query && (
          <button className="btn btn-secondary" type="button" onClick={() => { setQuery(''); setSearch(''); setPage(1); }}>
            Clear
          </button>
        )}
      </form>

      {data && <p className="text-muted text-sm" style={{ marginBottom: 10 }}>{data.total.toLocaleString()} results</p>}

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Player</th>
                <th>VND</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!data && <tr><td colSpan={7} className="text-muted">Loading…</td></tr>}
              {data?.data.length === 0 && <tr><td colSpan={7} className="text-muted">No results.</td></tr>}
              {data?.data.map((row) => (
                <tr key={row.id}>
                  <td className="text-muted">{row.id}</td>
                  <td><strong>{row.username}</strong></td>
                  <td>{row.player_name ?? <span className="text-muted">—</span>}</td>
                  <td>{Number(row.vnd ?? 0).toLocaleString()}</td>
                  <td>
                    {row.ban
                      ? <span className="badge badge-red">Banned</span>
                      : <span className="badge badge-green">Active</span>}
                  </td>
                  <td className="text-muted text-sm">{fmtDate(row.last_time_login)}</td>
                  <td>
                    <Link to={`/players/${row.id}`} className="btn btn-secondary btn-sm">View</Link>
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
