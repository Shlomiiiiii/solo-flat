import { useEffect, useState } from 'react';
import { Topbar } from './topbar';
import { useAuth } from './auth-context';
import { api } from './api';

export function SettingsPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<any>(null);
  useEffect(() => {
    api.status().then(setStatus).catch(() => setStatus(null));
  }, []);
  return (
    <div>
      <Topbar title="Settings" subtitle="Account & integrations" showSearch={false} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 18,
        }}
      >
        <div className="card">
          <p className="statLabel">Admin</p>
          <p style={{ margin: '6px 0', fontSize: 14 }}>
            {user?.email || 'solophotography@icloud.com'}
          </p>
        </div>
        <div className="card">
          <p className="statLabel">Backend</p>
          <p style={{ margin: '6px 0', fontSize: 13 }}>{api.backendUrl}</p>
        </div>
        <div className="card">
          <p className="statLabel">Data Store</p>
          <p style={{ margin: '6px 0', fontSize: 14, textTransform: 'capitalize' }}>
            {status?.store || '—'}
          </p>
        </div>
        <div className="card">
          <p className="statLabel">AI</p>
          <p style={{ margin: '6px 0', fontSize: 14 }}>
            {status?.gemini ? 'Google Gemini ✓' : 'Demo replies'}
          </p>
        </div>
      </div>
    </div>
  );
}
