import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import styles from './AuthPage.module.css';

interface RegisterFormState {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuthContext();

  const [form, setForm] = useState<RegisterFormState>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        email: form.email.trim(),
        password: form.password,
      });

      navigate('/', { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={styles.page} aria-label="Registration page">
      <h2 className={styles.heading}>Create Account</h2>
      <p className={styles.subheading}>Use at least 8 characters with one uppercase letter and one digit.</p>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <label className={styles.label} htmlFor="register-email">Email</label>
        <input
          id="register-email"
          className={styles.input}
          aria-label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          autoComplete="email"
          required
        />

        <label className={styles.label} htmlFor="register-password">Password</label>
        <input
          id="register-password"
          className={styles.input}
          aria-label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          autoComplete="new-password"
          required
          minLength={8}
        />

        <p className={styles.hint}>Password must include at least one uppercase letter and one number.</p>

        <label className={styles.label} htmlFor="register-confirm-password">Confirm Password</label>
        <input
          id="register-confirm-password"
          className={styles.input}
          aria-label="Confirm password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={onChange}
          autoComplete="new-password"
          required
          minLength={8}
        />

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button className={styles.button} type="submit" aria-label="Register" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className={styles.switchText}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </section>
  );
}
