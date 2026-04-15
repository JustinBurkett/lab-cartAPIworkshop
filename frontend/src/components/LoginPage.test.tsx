import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import LoginPage from './LoginPage';

const mockLogin = vi.fn();

vi.mock('../contexts/AuthContext', () => ({
  useAuthContext: () => ({
    login: mockLogin,
  }),
}));

describe('LoginPage', () => {
  it('shows validation error when submitting empty fields', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Email and password are required.');
    expect(mockLogin).not.toHaveBeenCalled();
  });
});
