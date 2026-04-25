import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client.js';

function fmtDate(d) { return d ? new Date(d).toLocaleString('vi-VN') : '—'; }
function fmtNum(n)  { return Number(n ?? 0).toLocaleString(); }

export default function PlayerDetail() {
  const { id } = useParams();
  const [data, setData]     = useState(null);
  const [error, setError]   = useState('');
  const [banLoading, setBanLoading] = useState(false);
  const [banMsg, setBanMsg]         = useState('');

  // Currency adjust modal
  const [adjModal, setAdjModal]   = useState(false);
  const [adjField, setAdjField]   = useState('vnd');
  const [adjDelta, setAdjDelta]   = useState('');
  const [adjReason, setAdjReason] = useState('');
  const [adjMsg, setAdjMsg]       = useState('');
  const [adjLoading, setAdjLoading] = useState(false);

  function load() {
    setData(null);
    client.get(`/players/${id}`)
      .then((r) => setData(r.data))
      .catch((e) => setError(e.response?.data?.error ?? 'Not found'));
  }

  useEffect(() => { load(); }, [id]);

  async function toggleBan() {
    if (!data) return;
    const newBan = !data.account.ban;
    if (!window.confirm(`${newBan ? 'Ban' : 'Unban'} account "${data.account.username}"?`)) return;
    setBanLoading(true);
    setBanMsg('');
    try {
      await client.post(`/players/${id}/ban`, { ban: newBan });
      setBanMsg(newBan ? 'Account banned.' : 'Account unbanned.');
      load();
    } catch (e) {
      setBanMsg(e.response?.data?.error ?? 'Error');
    } finally {
      setBanLoading(false);
    }
  }

  async function submitAdjust(e) {
    e.preventDefault();
    const delta = parseInt(adjDelta, 10);
    if (isNaN(delta) || delta === 0) { setAdjMsg('Enter a non-zero integer.'); return; }
    setAdjLoading(true);
    setAdjMsg('');
    try {
      const { data: r } = await client.post(`/players/${id}/adjust-currency`, {
        field: adjField, delta, reason: adjReason,
      });
      setAdjMsg(`Done: ${adjField} ${r.oldVal} → ${r.newVal}`);
      load();
    } catch (e) {
      setAdjMsg(e.response?.data?.error ?? 'Error');
    } finally {
      setAdjLoading(false);
    }
  }

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!data)  return <div className="text-muted">Loading…</div>;

  const { account, player, payments } = data;

  return (
    <>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1>Account: {account.username}</h1>
          <p>ID #{account.id} — {player ? `Player: ${player.name}` : 'No character'}</p>
        </div>
        <Link to="/players" className="btn btn-secondary">← Back</Link>
      </div>

      {banMsg && <div className="alert alert-info">{banMsg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Account info */}
        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Account Info</h2>
          <table style={{ width: '100%' }}>
            <tbody>
              {[
                ['Email',       account.email || '—'],
                ['Status',      account.ban ? '🚫 Banned' : '✅ Active'],
                ['VND',         fmtNum(account.vnd)],
                ['Vàng nạp',    fmtNum(account.tongnap)],
                ['Vàng',        fmtNum(account.vang)],
                ['VIP',         account.vip],
                ['Server',      account.server_login >= 0 ? `Online (S${account.server_login})` : 'Offline'],
                ['Last login',  fmtDate(account.last_time_login)],
                ['IP',          account.ip_address || '—'],
                ['Created',     fmtDate(account.create_time)],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td className="text-muted text-sm" style={{ padding: '5px 0', width: '40%' }}>{k}</td>
                  <td style={{ padding: '5px 0' }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button
              className={`btn btn-sm ${account.ban ? 'btn-success' : 'btn-danger'}`}
              onClick={toggleBan}
              disabled={banLoading}
            >
              {banLoading ? '…' : account.ban ? 'Unban Account' : 'Ban Account'}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => { setAdjModal(true); setAdjMsg(''); }}>
              Adjust Currency
            </button>
          </div>
        </div>

        {/* Player info */}
        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Character Info</h2>
          {!player
            ? <p className="text-muted">No character created.</p>
            : (
              <table style={{ width: '100%' }}>
                <tbody>
                  {[
                    ['Name',    player.name],
                    ['Rank',    fmtNum(player.rank)],
                    ['Gender',  player.gender === 0 ? 'Male' : 'Female'],
                    ['Clan ID', player.clan_id === -1 ? 'None' : player.clan_id],
                    ['Created', fmtDate(player.create_time)],
                  ].map(([k, v]) => (
                    <tr key={k}>
                      <td className="text-muted text-sm" style={{ padding: '5px 0', width: '40%' }}>{k}</td>
                      <td style={{ padding: '5px 0' }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>

      {/* Payment history */}
      <div className="card">
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Payment History</h2>
        {payments.length === 0
          ? <p className="text-muted">No payments found.</p>
          : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Date</th>
                    <th>Declared</th>
                    <th>Credited</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td className="text-muted text-sm">{p.refNo}</td>
                      <td className="text-muted text-sm">{fmtDate(p.date)}</td>
                      <td>{fmtNum(p.declared_amount)} đ</td>
                      <td>{fmtNum(p.final_credited_amount)} đ</td>
                      <td>
                        {p.is_credited
                          ? <span className="badge badge-green">Credited</span>
                          : <span className="badge badge-yellow">{p.status_text}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {/* Adjust currency modal */}
      {adjModal && (
        <div className="modal-backdrop" onClick={() => setAdjModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Adjust Currency — {account.username}</h2>
            <form onSubmit={submitAdjust}>
              <div className="form-row">
                <label>Field</label>
                <select value={adjField} onChange={(e) => setAdjField(e.target.value)}>
                  <option value="vnd">VND</option>
                  <option value="vang">Vàng</option>
                  <option value="vip">VIP</option>
                  <option value="tichdiem">Tích điểm</option>
                  <option value="event_point">Event Point</option>
                </select>
              </div>
              <div className="form-row">
                <label>Delta (positive = add, negative = subtract)</label>
                <input className="input" type="number" required value={adjDelta} onChange={(e) => setAdjDelta(e.target.value)} />
              </div>
              <div className="form-row">
                <label>Reason</label>
                <input className="input" type="text" value={adjReason} onChange={(e) => setAdjReason(e.target.value)} placeholder="Admin compensation…" />
              </div>
              {adjMsg && <div className="alert alert-info" style={{ marginBottom: 10 }}>{adjMsg}</div>}
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary" type="submit" disabled={adjLoading}>
                  {adjLoading ? '…' : 'Apply'}
                </button>
                <button className="btn btn-secondary" type="button" onClick={() => setAdjModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
