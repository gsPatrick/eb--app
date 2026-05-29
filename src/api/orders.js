import apiClient, { unwrapList, unwrapResponse } from './api-client';
import { mapServiceExtra, mapServiceOrder } from './mappers';

export async function list(params = {}) {
  const response = await apiClient.get('/service-orders', { params });
  const { items, meta } = unwrapList(response);
  return { items: items.map(mapServiceOrder), meta };
}

export async function getById(id) {
  const response = await apiClient.get(`/service-orders/${id}`);
  return mapServiceOrder(unwrapResponse(response).order);
}

function buildOrderFormData({ lat, long, photos = [] }) {
  const formData = new FormData();
  formData.append('lat', String(lat));
  formData.append('long', String(long));
  photos.forEach((photo) => {
    if (photo?.uri) {
      formData.append('photos', {
        uri: photo.uri,
        name: photo.name || `photo-${Date.now()}.jpg`,
        type: photo.type || 'image/jpeg',
      });
    } else if (photo instanceof File || (typeof File !== 'undefined' && photo instanceof File)) {
      formData.append('photos', photo);
    }
  });
  return formData;
}

export async function checkIn(id, { lat, long, photos }) {
  const formData = buildOrderFormData({ lat, long, photos });
  const response = await apiClient.post(`/service-orders/${id}/check-in`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return mapServiceOrder(unwrapResponse(response).order);
}

export async function checkOut(id, { lat, long, photos }) {
  const formData = buildOrderFormData({ lat, long, photos });
  const response = await apiClient.post(`/service-orders/${id}/check-out`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return mapServiceOrder(unwrapResponse(response).order);
}

export async function addExtra(id, extraId) {
  const response = await apiClient.post(`/service-orders/${id}/extras`, { extraId });
  return mapServiceOrder(unwrapResponse(response).order);
}

export async function listExtras(params = {}) {
  const response = await apiClient.get('/service-extras', { params });
  const { items, meta } = unwrapList(response);
  return { items: items.map(mapServiceExtra), meta };
}

export async function requestExtra(id, extraId) {
  const response = await apiClient.post(`/service-orders/${id}/request-extras`, { extraId });
  return mapServiceOrder(unwrapResponse(response).order);
}
