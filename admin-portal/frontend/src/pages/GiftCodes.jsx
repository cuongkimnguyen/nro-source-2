import { useEffect, useState } from 'react';
import client from '../api/client.js';

function fmtDate(d) { return d ? new Date(d).toLocaleDateString('vi-VN') : '—'; }

const EMPTY_FORM = { code: '', count_left: '', detail: '[]', expired: '2037-12-31T17:00:00' };

export default function GiftCodes() {
  const [page, setPage]       = useState(1);
  const [data, setData]       = useState(null);
  const [error, setError]     = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [formMsg, setFormMsg] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const LIMIT = 20;

  function load() {
    client.get('/giftcodes', { params: { page, limit: LIMIT } })
      .then((r) => setData(r.data))
      .catch((e) => setError(e.response?.data?.error ?? 'Error'));
  }

  useEffect(() => { load(); }, [page]);

  async function handleCreate(e) {
    e.preventDefault();
    setFormMsg('');
    setFormLoading(true);
    try {
      await client.post('/giftcodes', {
        code: form.code.trim(),
        count_left: parseInt(form.count_left, 10),
        detail: form.detail,
        expired: form.expired.replace('T', ' '),
      });
      setFormMsg('Gift code created!');
      setForm(EMPTY_FORM);
      load();
    } catch (e) {
      setFormMsg(e.response?.data?.error ?? 'Error');
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDisable(id, code) {
    if (!window.confirm(`Disable gift code "${code}"? (count_left → 0)`)) return;
    try {
      await client.post(`/giftcodes/${id}/disable`);
      load();
    } catch (e) {
      setError(e.response?.data?.error ?? 'Error');
    }
  }

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 1;

  return (
    <>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1>Gift Codes</h1>
          <p>Manage gift codes for players</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setFormMsg(''); }}>
          {showForm ? 'Cancel' : '+ New Code'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Create Gift Code</h2>
          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-row">
                <label>Code (string)</label>
                <input className="input" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. SUMMER2025" />
              </div>
              <div className="form-row">
                <label>Uses (count_left)</label>
                <input className="input" type="number" min="1" required value={form.count_left} onChange={(e) => setForm({ ...form, count_left: e.target.value })} />
              </div>
              <div className="form-row" style={{ gridColumn: '1 / -1' }}>
                <label>Detail (JSON array of items)</label>
                <textarea className="input" rows={4} required value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} />
              </div>
              <div className="form-row">
                <label>Expires</label>
                <input className="input" type="datetime-local" value={form.expired} onChange={(e) => setForm({ ...form, expired: e.target.value })} />
              </div>
            </div>
            {formMsg && <div className={`alert ${formMsg.includes('!') ? 'alert-success' : 'alert-error'}`}>{formMsg}</div>}
            <button className="btn btn-primary" type="submit" disabled={formLoading}>
              {formLoading ? 'Creating…' : 'Create'}
            </button>
          </form>
        </div>
      )}

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Code</th>
                <th>Uses Left</th>
                <th>Created</th>
                <th>Expires</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!data && <tr><td colSpan={6} className="text-muted">Loading…</td></tr>}
              {data?.data.length === 0 && <tr><td colSpan={6} className="text-muted">No gift codes.</td></tr>}
              {data?.data.map((gc) => (
                <tr key={gc.id}>
                  <td className="text-muted">{gc.id}</td>
                  <td><strong>{gc.code}</strong></td>
                  <td>
                    {gc.count_left === 0
                      ? <span className="badge badge-gray">Disabled</span>
                      : <span className="badge badge-green">{gc.count_left}</span>}
                  </td>
                  <td className="text-muted text-sm">{fmtDate(gc.datecreate)}</td>
                  <td className="text-muted text-sm">{fmtDate(gc.expired)}</td>
                  <td>
                    {gc.count_left !== 0 && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleDisable(gc.id, gc.code)}>
                        Disable
                      </button>
                    )}
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
