import type { ReactNode } from 'react';
import { Search } from 'lucide-react';

export function Topbar({
  title,
  subtitle,
  actions,
  showSearch = true,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  showSearch?: boolean;
}) {
  return (
    <div className="topbar">
      <div>
        <h1 className="pageTitle">{title}</h1>
        {subtitle && <p className="pageSubtitle">{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {showSearch && (
          <div className="search">
            <Search size={15} color="rgba(245,243,239,0.5)" />
            <input placeholder="Search…" />
          </div>
        )}
        {actions}
      </div>
    </div>
  );
}
