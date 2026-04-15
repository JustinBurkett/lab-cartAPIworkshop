import type { AuthResponse, AuthSession } from '../types/auth';

const AUTH_STORAGE_KEY = 'buckeye.auth.session';

export function getStoredSession(): AuthSession | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed.accessToken || !parsed.user?.email) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function persistSession(auth: AuthResponse): AuthSession {
  const session: AuthSession = {
    accessToken: auth.accessToken,
    accessTokenExpiresAtUtc: auth.accessTokenExpiresAtUtc,
    refreshToken: auth.refreshToken,
    refreshTokenExpiresAtUtc: auth.refreshTokenExpiresAtUtc,
    user: {
      email: auth.email,
      roles: auth.roles,
    },
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function clearStoredSession(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getStoredAccessToken(): string | null {
  return getStoredSession()?.accessToken ?? null;
}
