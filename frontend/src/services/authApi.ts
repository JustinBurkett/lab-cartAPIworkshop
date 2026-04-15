import { API_ENDPOINTS } from '../constants/api';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';
import { apiFetch } from './httpClient';

export async function loginUser(payload: LoginRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>(API_ENDPOINTS.authLogin, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function registerUser(payload: RegisterRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>(API_ENDPOINTS.authRegister, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
