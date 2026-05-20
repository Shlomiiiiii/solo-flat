import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  Wallet,
  CreditCard,
  Sparkles,
  Settings,
  Camera,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from './auth-context';

const items = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/properties', label: 'Properties', icon: Building2 },
  { to: '/admin/clients', label: 'Clients', icon: Users },
  { to: '/admin/finances', label: 'Finances', icon: Wallet },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/ai', label: 'AI Assistant', icon: Sparkles },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll when the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Mobile top bar with hamburger — hidden on desktop via CSS */}
      <header className="mobileBar">
        <button
          className="hamburger"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div className="brand" style={{ margin: 0 }}>
          <Camera size={18} color="#c4a766" />
          Solo<span>Photography</span>
        </div>
        <div style={{ width: 36 }} />
      </header>

      {/* Backdrop for mobile drawer */}
      {open && <div className="drawerBackdrop" onClick={() => setOpen(false)} />}

      <aside className={`sidebar ${open ? 'sidebarOpen' : ''}`}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <div className="brand" style={{ margin: 0 }}>
            <Camera size={22} color="#c4a766" />
            Solo<span>Photography</span>
          </div>
          <button
            className="drawerClose"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => (isActive ? 'navItem navItemActive' : 'navItem')}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
        <div className="sidebarFoot">
          <strong>Admin</strong>
          <br />
          {user?.email}
          <button
            onClick={signOut}
            className="navItem"
            style={{
              marginTop: 10,
              width: '100%',
              background: 'transparent',
              border: '1px solid rgba(245,243,239,0.08)',
              fontFamily: 'inherit',
            }}
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
