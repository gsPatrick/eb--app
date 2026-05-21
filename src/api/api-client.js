import axios from 'axios';
import { clearAuthSession, getToken } from './storage';
import { navigate } from '../navigation/navigationRef';

export const API_BASE_URL = 'https://sistema-api.a8v108.easypanel.host/api/v1';
export const API_ORIGIN = 'https://sistema-api.a8v108.easypanel.host';
export const SOCKET_URL = 'https://sistema-api.a8v108.easypanel.host';

let onUnauthorized = null;
let onForbidden = null;

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

export function setForbiddenHandler(handler) {
  onForbidden = handler;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { Accept: 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401) {
      await clearAuthSession();
      onUnauthorized?.();
    }

    if (status === 403 && !error.config?.skipForbiddenRedirect) {
      onForbidden?.();
      navigate('Forbidden');
    }

    const message =
      data?.message || data?.error?.message || error.message || 'Unexpected error. Please try again.';

    const apiError = new Error(message);
    apiError.code = data?.error?.code || data?.code;
    apiError.details = data?.error?.details || data?.details;
    apiError.status = status;
    return Promise.reject(apiError);
  }
);

export function unwrapResponse(response) {
  return response.data?.data ?? response.data;
}

export function unwrapList(response) {
  const body = response.data;
  return { items: body?.data ?? [], meta: body?.meta ?? null };
}

export default apiClient;
