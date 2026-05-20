import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { AIChat } from './ai-chat';
import { useAuth } from './auth-context';

export function AdminShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="app">
      <div className="shell">
        <Sidebar />
        <main className="main">{children}</main>
      </div>
      <AIChat />
    </div>
  );
}
