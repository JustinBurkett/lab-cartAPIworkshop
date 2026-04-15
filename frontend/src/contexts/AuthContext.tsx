import { createContext, useContext, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { AuthSession, LoginRequest, RegisterRequest } from '../types/auth';
import { clearStoredSession, getStoredSession, persistSession } from '../services/authStorage';
import { loginUser, registerUser } from '../services/authApi';
import { authReducer } from '../reducers/authReducer';

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
  const [state, dispatch] = useReducer(authReducer, {
    session: getStoredSession() as AuthSession | null,
  });

  async function login(payload: LoginRequest) {
    const response = await loginUser(payload);
    const nextSession = persistSession(response);
    dispatch({ type: 'SET_SESSION', payload: nextSession });
  }

  async function register(payload: RegisterRequest) {
    const response = await registerUser(payload);
    const nextSession = persistSession(response);
    dispatch({ type: 'SET_SESSION', payload: nextSession });
  }

  function logout() {
    clearStoredSession();
    dispatch({ type: 'CLEAR_SESSION' });
  }

  const value = useMemo<AuthContextValue>(() => ({
    session: state.session,
    isAuthenticated: state.session !== null,
    isAdmin: state.session?.user.roles.includes('Admin') ?? false,
    login,
    register,
    logout,
  }), [state.session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
}
