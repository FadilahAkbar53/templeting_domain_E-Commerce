import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = '/api';

const LoginPage: React.FC = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      await login(username, password);
      // Login success, AuthProvider will handle redirect
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setError('');
    setSuccess('');
    
    // Validasi
    if (!username || !password) {
      setError('Username dan password harus diisi');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }
    
    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registrasi gagal');
      }

      const data = await response.json();
      setSuccess('Registrasi berhasil! Silakan login.');
      
      // Reset form
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setRole('user');
      
      // Switch to login mode after 2 seconds
      setTimeout(() => {
        setIsRegisterMode(false);
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat registrasi');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError('');
    setSuccess('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setRole('user');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-theme-bg-secondary">
      <div className="w-full max-w-md p-8 space-y-8 bg-theme-bg-primary rounded-2xl shadow-xl">
        <div className="flex flex-col items-center">
          <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.93 64.06" className="h-16 w-auto text-theme-primary" fill="currentColor">
            <polygon points="29.93 38.78 25.78 33.15 23.17 35.08 23.16 35.09 28.99 6.06 28.99 6.06 25.49 0 0 14.72 2.21 21.52 20.91 10.73 20.91 10.73 14.79 41.26 14.78 41.26 9.81 44.92 12.09 51.93 21.12 45.28 29.93 38.78"/>
            <polygon points="13.85 57.36 16.03 64.06 23.08 64.06 25.26 57.36 19.55 53.21 13.85 57.36"/>
          </svg>
          <h2 className="mt-4 text-3xl font-extrabold text-center text-theme-text-base">
            {isRegisterMode ? 'Create Account' : 'Sign in to OneDering'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); isRegisterMode ? handleRegister() : handleLogin(); }}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-3 border border-theme-border bg-theme-bg-secondary placeholder-theme-text-muted text-theme-text-base ${isRegisterMode ? 'rounded-t-md' : 'rounded-t-md'} focus:outline-none focus:ring-theme-primary focus:border-theme-primary focus:z-10 sm:text-sm`}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isRegisterMode ? "new-password" : "current-password"}
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-3 border border-theme-border bg-theme-bg-secondary placeholder-theme-text-muted text-theme-text-base ${!isRegisterMode ? 'rounded-b-md' : ''} focus:outline-none focus:ring-theme-primary focus:border-theme-primary focus:z-10 sm:text-sm`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {isRegisterMode && (
              <>
                <div>
                  <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-theme-border bg-theme-bg-secondary placeholder-theme-text-muted text-theme-text-base focus:outline-none focus:ring-theme-primary focus:border-theme-primary focus:z-10 sm:text-sm"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="role" className="sr-only">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-theme-border bg-theme-bg-secondary placeholder-theme-text-muted text-theme-text-base rounded-b-md focus:outline-none focus:ring-theme-primary focus:border-theme-primary focus:z-10 sm:text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </>
            )}
          </div>
          
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
              <p className="text-sm text-center text-red-600 dark:text-red-300">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-3">
              <p className="text-sm text-center text-green-600 dark:text-green-300">{success}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-theme-primary hover:bg-theme-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (isRegisterMode ? 'Creating account...' : 'Signing in...') : (isRegisterMode ? 'Create Account' : 'Sign in')}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-theme-primary hover:text-theme-primary-hover font-medium"
            >
              {isRegisterMode ? 'Already have an account? Sign in' : 'Don\'t have an account? Register'}
            </button>
          </div>

          {!isRegisterMode && (
            <div className="text-center text-xs text-theme-text-muted">
              <p>User: user / password</p>
              <p>Admin: admin / password</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
