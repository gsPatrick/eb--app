import apiClient, { API_ORIGIN, unwrapResponse } from './api-client';

function resolvePhotoUrl(url) {
  if (!url) return null;
  return url.startsWith('http') ? url : `${API_ORIGIN}${url}`;
}

function mapFieldReport(report) {
  if (!report) return null;
  return {
    id: report.id,
    type: report.type,
    description: report.description,
    status: report.status,
    photos: (report.photos || []).map(resolvePhotoUrl).filter(Boolean),
    createdAt: report.createdAt || report.created_at,
  };
}

function buildReportFormData({ serviceOrderId, type, description, photos = [] }) {
  const formData = new FormData();
  formData.append('serviceOrderId', serviceOrderId);
  formData.append('type', type);
  formData.append('description', description);
  photos.forEach((photo) => {
    if (photo?.uri) {
      formData.append('photos', {
        uri: photo.uri,
        name: photo.name || `report-${Date.now()}.jpg`,
        type: photo.type || 'image/jpeg',
      });
    }
  });
  return formData;
}

export async function create({ serviceOrderId, type, description, photos }) {
  const formData = buildReportFormData({ serviceOrderId, type, description, photos });
  const response = await apiClient.post('/field-reports', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  const result = unwrapResponse(response);
  return mapFieldReport(result.report);
}

export { mapFieldReport };
