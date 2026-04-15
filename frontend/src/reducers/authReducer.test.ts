import { describe, expect, it } from 'vitest';
import { authReducer, type AuthState } from './authReducer';
import type { AuthSession } from '../types/auth';

describe('authReducer', () => {
  const initialState: AuthState = {
    session: null,
  };

  const session: AuthSession = {
    accessToken: 'token',
    accessTokenExpiresAtUtc: '2099-01-01T00:00:00Z',
    refreshToken: 'refresh',
    refreshTokenExpiresAtUtc: '2099-01-02T00:00:00Z',
    user: {
      email: 'admin@buckeyemarketplace.local',
      roles: ['Admin'],
    },
  };

  it('sets session for SET_SESSION', () => {
    const nextState = authReducer(initialState, {
      type: 'SET_SESSION',
      payload: session,
    });

    expect(nextState.session).toEqual(session);
  });

  it('clears session for CLEAR_SESSION', () => {
    const withSession: AuthState = {
      session,
    };

    const nextState = authReducer(withSession, {
      type: 'CLEAR_SESSION',
    });

    expect(nextState.session).toBeNull();
  });
});
