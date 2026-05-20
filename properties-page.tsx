import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize2, Lock, Unlock, Loader2 } from 'lucide-react';
import { Topbar } from './topbar';
import { api } from './api';
import { useApi } from './use-api';

export function PropertiesPage() {
  const [filter, setFilter] = useState<'All' | 'Locked' | 'Unlocked' | 'Published'>('All');
  const propsQ = useApi(() => api.properties.list(), []);
  const properties = propsQ.data || [];
  const list = properties.filter((p) => {
    if (filter === 'Locked') return p.isLocked;
    if (filter === 'Unlocked') return !p.isLocked;
    if (filter === 'Published') return p.published;
    return true;
  });
  return (
    <div>
      <Topbar title="Properties" subtitle={`${properties.length} galleries`} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
        {(['All', 'Locked', 'Unlocked', 'Published'] as const).map((f) => (
          <button
            key={f}
            className="btn"
            onClick={() => setFilter(f)}
            style={
              filter === f
                ? {
                    borderColor: 'rgba(196,167,102,0.4)',
                    background: 'rgba(196,167,102,0.1)',
                    color: '#c4a766',
                  }
                : undefined
            }
          >
            {f}
          </button>
        ))}
      </div>
      {propsQ.loading && (
        <div style={{ padding: 40, textAlign: 'center', color: 'rgba(245,243,239,0.5)' }}>
          <Loader2 size={20} /> Loading…
        </div>
      )}
      <div className="propertyGrid">
        {list.map((p) => (
          <div key={p.id} className="propertyCard">
            <div style={{ position: 'relative' }}>
              <Link to={`/gallery/${p.shareSlug}`}>
                <img src={p.coverImage} className="propertyImg" alt={p.address} />
              </Link>
              <div style={{ position: 'absolute', top: 14, right: 14 }}>
                <span className={`badge ${p.isLocked ? 'badgeLocked' : 'badgePaid'}`}>
                  {p.isLocked ? <Lock size={10} /> : <Unlock size={10} />}
                  {p.isLocked ? 'Locked' : 'Unlocked'}
                </span>
              </div>
            </div>
            <div className="propertyBody">
              <Link to={`/gallery/${p.shareSlug}`} style={{ color: 'inherit' }}>
                <p className="propertyAddress">{p.address}</p>
                <p className="propertyLoc">
                  {p.city}, {p.state} {p.zip}
                </p>
              </Link>
              <div className="propertyMeta">
                <span>
                  <Bed size={12} /> {p.bedrooms || '—'} bd
                </span>
                <span>
                  <Bath size={12} /> {p.bathrooms || '—'} ba
                </span>
                <span>
                  <Maximize2 size={12} /> {p.squareFeet?.toLocaleString() || '—'} sqft
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className="propertyPrice">${p.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
