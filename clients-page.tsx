import { useMemo, useState } from 'react';
import { Mail, Phone, Loader2 } from 'lucide-react';
import { Topbar } from './topbar';
import { api } from './api';
import { useApi } from './use-api';

export function ClientsPage() {
  const [query, setQuery] = useState('');
  const clientsQ = useApi(() => api.clients.list(), []);
  const clients = clientsQ.data || [];
  const list = useMemo(() => {
    const sorted = [...clients].sort((a, b) => a.fullName.localeCompare(b.fullName));
    const q = query.toLowerCase().trim();
    if (!q) return sorted;
    return sorted.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q),
    );
  }, [query, clients]);
  return (
    <div>
      <Topbar
        title="Clients"
        subtitle={`${clients.length} clients · A → Z`}
        showSearch={false}
        actions={
          <div className="search">
            <input
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        }
      />
      {clientsQ.loading && (
        <div style={{ padding: 40, textAlign: 'center', color: 'rgba(245,243,239,0.5)' }}>
          <Loader2 size={20} /> Loading…
        </div>
      )}
      {!clientsQ.loading && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Galleries</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id}>
                  <td>
                    <strong style={{ fontWeight: 500 }}>{c.fullName}</strong>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                      <Mail size={12} color="rgba(245,243,239,0.4)" /> {c.email}
                    </span>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                      <Phone size={12} color="rgba(245,243,239,0.4)" /> {c.phone}
                    </span>
                  </td>
                  <td>{c.galleries}</td>
                  <td style={{ color: '#c4a766' }}>${c.totalSpent.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
