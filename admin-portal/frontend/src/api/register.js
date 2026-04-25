import axios from 'axios';

// Standalone axios instance — no auth token attached, public endpoint.
const publicClient = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

/**
 * POST /api/register
 * @param {{ username: string, password: string, retypePassword: string }} data
 * @returns {Promise<{ success: boolean, message?: string, error?: { code: string, message: string } }>}
 */
export async function registerAccount(data) {
  const res = await publicClient.post('/register', data);
  return res.data;
}
