import { useEffect, useState } from 'react';
import client from '../api/client.js';

export default function ServerStatus() {
  const [status, setStatus]       = useState(null);
  const [error, setError]         = useState('');
  const [maintMsg, setMaintMsg]   = useState('');
  const [maintLoading, setMaintLoading] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcast, setBroadcast] = useState('');
  const [broadcastLoading, setBroadcastLoading] = useState(false);

  function load() {
    client.get('/server/status')
      .then((r) => setStatus(r.data))
      .catch((e) => setError(e.response?.data?.error ?? 'Error'));
  }

  useEffect(() => { load(); }, []);

  async function toggleMaintenance() {
    if (!status) return;
    const enable = status.trangthai !== 'baotri';
    if (!window.confirm(`${enable ? 'Enable' : 'Disable'} maintenance mode?`)) return;
    setMaintLoading(true);
    setMaintMsg('');
    try {
      await client.post('/server/maintenance', { enable });
      setMaintMsg(enable ? 'Maintenance mode enabled.' : 'Server back online.');
      load();
    } catch (e) {
      setMaintMsg(e.response?.data?.error ?? 'Error');
    } finally {
      setMaintLoading(false);
    }
  }

  async function sendBroadcast(e) {
    e.preventDefault();
    if (!broadcast.trim()) return;
    setBroadcastLoading(true);
    setBroadcastMsg('');
    try {
      const { data: r } = await client.post('/server/broadcast', { message: broadcast.trim() });
      setBroadcastMsg(r.note ?? 'Sent.');
      setBroadcast('');
    } catch (e) {
      setBroadcastMsg(e.response?.data?.error ?? 'Error');
    } finally {
      setBroadcastLoading(false);
    }
  }

  const isOnline = status?.trangthai === 'hoatdong';

  return (
    <>
      <div className="page-header">
        <h1>Server Control</h1>
        <p>Maintenance mode and server broadcast</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Status card */}
        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Server Status</h2>
          {!status
            ? <p className="text-muted">Loading…</p>
            : (
              <>
                <table style={{ width: '100%', marginBottom: 16 }}>
                  <tbody>
                    {[
                      ['Name',   status.tenmaychu ?? '—'],
                      ['Domain', status.domain     ?? '—'],
                      ['Status', isOnline
                          ? <span className="badge badge-green">Online</span>
                          : <span className="badge badge-red">Maintenance</span>],
                      ['Android', status.android ?? '—'],
                    ].map(([k, v]) => (
                      <tr key={k}>
                        <td className="text-muted text-sm" style={{ padding: '5px 0', width: '35%' }}>{k}</td>
                        <td style={{ padding: '5px 0' }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {maintMsg && <div className="alert alert-info">{maintMsg}</div>}

                <button
                  className={`btn ${isOnline ? 'btn-danger' : 'btn-success'}`}
                  onClick={toggleMaintenance}
                  disabled={maintLoading}
                >
                  {maintLoading ? '…' : isOnline ? '🔴 Enable Maintenance' : '🟢 Go Online'}
                </button>
              </>
            )}
        </div>

        {/* Broadcast */}
        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Broadcast Notice</h2>
          <p className="text-muted text-sm" style={{ marginBottom: 12 }}>
            Stores in the notify table. In-game delivery requires socket integration.
          </p>
          <form onSubmit={sendBroadcast}>
            <div className="form-row">
              <label>Message</label>
              <textarea
                className="input"
                rows={4}
                required
                value={broadcast}
                onChange={(e) => setBroadcast(e.target.value)}
                placeholder="Server maintenance in 10 minutes…"
              />
            </div>
            {broadcastMsg && <div className="alert alert-info">{broadcastMsg}</div>}
            <button className="btn btn-primary" type="submit" disabled={broadcastLoading}>
              {broadcastLoading ? 'Sending…' : 'Send Broadcast'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
