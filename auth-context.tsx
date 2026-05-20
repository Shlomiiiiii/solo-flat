import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, type AdminUser } from './api';

type AuthContextValue = {
  user: AdminUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'solo-admin-user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AdminUser) : null;
    } catch {
      return null;
    }
  });
  useEffect(() => {
    if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(STORAGE_KEY);
  }, [user]);
  async function signIn(email: string, password: string) {
    const { user: u } = await api.auth.signIn(email, password);
    setUser(u);
  }
  function signOut() {
    setUser(null);
  }
  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
