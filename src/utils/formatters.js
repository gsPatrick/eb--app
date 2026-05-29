const EARTH_RADIUS_M = 6371000;

export function haversineDistanceMeters(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function isWithinGeofence(userLat, userLng, targetLat, targetLng, radiusMeters = 200) {
  const distance = haversineDistanceMeters(userLat, userLng, targetLat, targetLng);
  return { within: distance <= radiusMeters, distance };
}

export function formatCurrency(value, locale = 'en-US') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(value || 0);
}

export function formatDate(value, locale = 'pt-BR') {
  if (!value) return '—';
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(value)
  );
}

export function formatTime(value) {
  if (!value) return '';
  if (typeof value === 'string' && value.includes(':')) return value;
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

export function getOrderStatusLabel(status) {
  return status;
}

export function getOrderStatusVariant(status) {
  const variants = {
    pending: 'warning',
    in_progress: 'info',
    completed: 'success',
    canceled: 'error',
    billed: 'default',
  };
  return variants[status] || 'default';
}
