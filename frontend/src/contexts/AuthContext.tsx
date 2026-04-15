import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthSession, LoginRequest, RegisterRequest } from '../types/auth';
import { clearStoredSession, getStoredSession, persistSession } from '../services/authStorage';
import { loginUser, registerUser } from '../services/authApi';

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(() => getStoredSession());

  async function login(payload: LoginRequest) {
    const response = await loginUser(payload);
    const nextSession = persistSession(response);
    setSession(nextSession);
  }

  async function register(payload: RegisterRequest) {
    const response = await registerUser(payload);
    const nextSession = persistSession(response);
    setSession(nextSession);
  }

  function logout() {
    clearStoredSession();
    setSession(null);
  }

  const value = useMemo<AuthContextValue>(() => ({
    session,
    isAuthenticated: session !== null,
    isAdmin: session?.user.roles.includes('Admin') ?? false,
    login,
    register,
    logout,
  }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
}
