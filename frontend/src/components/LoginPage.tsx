import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import styles from './AuthPage.module.css';

interface LoginFormState {
  email: string;
  password: string;
}

interface LocationState {
  from?: {
    pathname?: string;
  };
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthContext();

  const [form, setForm] = useState<LoginFormState>({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locationState = location.state as LocationState | undefined;
  const redirectTo = locationState?.from?.pathname ?? '/';

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({
        email: form.email.trim(),
        password: form.password,
      });

      navigate(redirectTo, { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={styles.page} aria-label="Login page">
      <h2 className={styles.heading}>Sign In</h2>
      <p className={styles.subheading}>Access your cart, checkout, and order history.</p>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <label className={styles.label} htmlFor="login-email">Email</label>
        <input
          id="login-email"
          className={styles.input}
          aria-label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          autoComplete="email"
          required
        />

        <label className={styles.label} htmlFor="login-password">Password</label>
        <input
          id="login-password"
          className={styles.input}
          aria-label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          autoComplete="current-password"
          required
        />

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button className={styles.button} type="submit" aria-label="Sign in" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className={styles.switchText}>
        Need an account? <Link to="/register">Register</Link>
      </p>
    </section>
  );
}
