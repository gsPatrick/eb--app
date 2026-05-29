import apiClient, { unwrapList, unwrapResponse } from './api-client';
import { mapProperty } from './mappers';

export async function list(params = {}) {
  const response = await apiClient.get('/properties', { params });
  const { items, meta } = unwrapList(response);
  return { items: items.map(mapProperty), meta };
}

export async function getById(id) {
  const response = await apiClient.get(`/properties/${id}`);
  const result = unwrapResponse(response);
  return mapProperty(result.property);
}
