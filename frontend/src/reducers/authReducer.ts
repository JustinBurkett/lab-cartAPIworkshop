import type { AuthSession } from '../types/auth';

export interface AuthState {
  session: AuthSession | null;
}

export type AuthAction =
  | { type: 'SET_SESSION'; payload: AuthSession }
  | { type: 'CLEAR_SESSION' };

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_SESSION':
      return {
        ...state,
        session: action.payload,
      };
    case 'CLEAR_SESSION':
      return {
        ...state,
        session: null,
      };
  }
}
