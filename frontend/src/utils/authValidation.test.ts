import { describe, expect, it } from 'vitest';
import { validateLoginForm } from './authValidation';

describe('validateLoginForm', () => {
  it('returns required error for empty fields', () => {
    const result = validateLoginForm('', '');

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('Email and password are required.');
  });

  it('returns email format error for invalid email', () => {
    const result = validateLoginForm('not-an-email', 'Password1');

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('Please enter a valid email address.');
  });

  it('passes for valid credentials', () => {
    const result = validateLoginForm('student@osu.edu', 'Password1');

    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });
});
