import apiClient, { unwrapResponse } from './api-client';

export async function create(payload) {
  const response = await apiClient.post('/reviews', payload);
  const result = unwrapResponse(response);
  return result.review;
}
