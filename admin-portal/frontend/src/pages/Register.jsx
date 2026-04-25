import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerAccount } from '../api/register.js';

const ERROR_MESSAGES = {
  PASSWORD_NOT_MATCH: 'Password confirmation does not match.',
  USERNAME_EXISTS: 'This username is already taken.',
  IP_REGISTER_LIMIT_EXCEEDED: 'This IP address has reached the account registration limit (max 2 accounts).',
  INVALID_USERNAME: 'Username must be 4–32 characters and contain only letters, digits, _ . -',
  INVALID_PASSWORD: 'Password must be between 4 and 64 characters.',
  INVALID_INPUT: 'Please fill in all fields correctly.',
  SERVER_ERROR: 'Server error. Please try again later.',
};

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Client-side password confirmation check before hitting the server
    if (password !== retypePassword) {
      setError(ERROR_MESSAGES.PASSWORD_NOT_MATCH);
      return;
    }

    setLoading(true);
    try {
      const data = await registerAccount({ username: username.trim(), password, retypePassword });

      if (data.success) {
        setSuccess(true);
        setPassword('');
        setRetypePassword('');
      } else {
        const code = data.error?.code;
        setError(ERROR_MESSAGES[code] ?? data.error?.message ?? 'Registration failed.');
      }
    } catch (err) {
      const code = err.response?.data?.error?.code;
      setError(ERROR_MESSAGES[code] ?? err.response?.data?.error?.message ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Create Account</h1>
        <p>Register a new game account</p>

        {success && (
          <div className="alert alert-success">
            Account created successfully! You can now log in to the game.
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        {!success && (
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <label htmlFor="reg-username">Username</label>
              <input
                id="reg-username"
                className="input"
                type="text"
                autoFocus
                required
                minLength={4}
                maxLength={32}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="4–32 characters, letters/digits/_ . -"
              />
            </div>
            <div className="form-row">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                className="input"
                type="password"
                required
                minLength={4}
                maxLength={64}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="form-row">
              <label htmlFor="reg-retype">Confirm Password</label>
              <input
                id="reg-retype"
                className="input"
                type="password"
                required
                minLength={4}
                maxLength={64}
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', marginTop: 8 }}
            >
              {loading ? 'Creating account…' : 'Register'}
            </button>
          </form>
        )}

        <p style={{ marginTop: 16, textAlign: 'center', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary, #3b82f6)' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
