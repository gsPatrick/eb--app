import apiClient, { unwrapList, unwrapResponse } from './api-client';
import { mapInventoryItem } from './mappers';

export async function list(params = {}) {
  const response = await apiClient.get('/inventory', { params });
  const { items, meta } = unwrapList(response);
  return { items: items.map(mapInventoryItem), meta };
}

export async function updateQuantity(id, quantity) {
  const response = await apiClient.patch(
    `/inventory/${id}/quantity`,
    { currentQuantity: quantity },
    { skipForbiddenRedirect: true }
  );
  const result = unwrapResponse(response);
  return mapInventoryItem(result.item || result.inventory);
}
