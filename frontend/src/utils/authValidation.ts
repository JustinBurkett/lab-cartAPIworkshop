export interface LoginValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

export function validateLoginForm(email: string, password: string): LoginValidationResult {
  const trimmedEmail = email.trim();

  if (!trimmedEmail || !password.trim()) {
    return {
      isValid: false,
      errorMessage: 'Email and password are required.',
    };
  }

  if (!trimmedEmail.includes('@')) {
    return {
      isValid: false,
      errorMessage: 'Please enter a valid email address.',
    };
  }

  return {
    isValid: true,
    errorMessage: null,
  };
}
