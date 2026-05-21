import apiClient, { unwrapResponse } from './api-client';
import { mapUser } from './mappers';
import { saveAuthSession } from './storage';

export async function login(credentials) {
  const response = await apiClient.post('/users/login', credentials);
  const result = unwrapResponse(response);
  const token = result.token;
  const user = mapUser(result.user);

  if (token && user) {
    await saveAuthSession(token, user);
  }

  return { token, user };
}

export async function register(payload) {
  const response = await apiClient.post('/users/register', payload);
  const result = unwrapResponse(response);
  return { user: mapUser(result.user) };
}

export async function me() {
  const response = await apiClient.get('/users/me');
  const result = unwrapResponse(response);
  return mapUser(result.user);
}

export async function updateMe(payload) {
  const response = await apiClient.patch('/users/me', payload);
  const result = unwrapResponse(response);
  return mapUser(result.user);
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** TODO: integrar POST /users/forgot-password */
export async function requestPasswordReset(email) {
  try {
    const response = await apiClient.post('/users/forgot-password', { email });
    return unwrapResponse(response);
  } catch (err) {
    if (!err.status || err.status === 404 || err.status === 501) {
      await delay(600);
      return { ok: true, stub: true };
    }
    throw err;
  }
}

/** TODO: integrar POST /users/verify-reset-otp */
export async function verifyPasswordResetOtp({ email, code }) {
  try {
    const response = await apiClient.post('/users/verify-reset-otp', { email, code });
    return unwrapResponse(response);
  } catch (err) {
    if (!err.status || err.status === 404 || err.status === 501) {
      await delay(600);
      if (code.length !== 5) {
        const error = new Error('INVALID_OTP');
        error.code = 'INVALID_OTP';
        throw error;
      }
      return { ok: true, stub: true };
    }
    throw err;
  }
}

/** TODO: integrar POST /users/reset-password */
export async function resetPassword({ email, code, password }) {
  try {
    const response = await apiClient.post('/users/reset-password', { email, code, password });
    return unwrapResponse(response);
  } catch (err) {
    if (!err.status || err.status === 404 || err.status === 501) {
      await delay(600);
      return { ok: true, stub: true };
    }
    throw err;
  }
}
