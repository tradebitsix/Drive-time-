import api from '../lib/api';

/**
 * Authenticate with the backend using username and password. On success,
 * stores the access token in localStorage.
 */
export async function login(username: string, password: string): Promise<void> {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  const response = await api.post('/api/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  const { access_token } = response.data;
  localStorage.setItem('token', access_token);
}

/**
 * Remove the stored token to log out.
 */
export function logout(): void {
  localStorage.removeItem('token');
}

/**
 * Check if a token is present in localStorage.
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}