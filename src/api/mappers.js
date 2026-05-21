import { API_ORIGIN } from './api-client';

export function resolveMediaUrl(url) {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `${API_ORIGIN}${url.startsWith('/') ? url : `/${url}`}`;
}

export function mapUser(user) {
  if (!user) return null;
  const name = user.name || '';
  return {
    id: user.id,
    name,
    firstName: name.split(' ')[0] || name,
    email: user.email,
    phone: user.phone || '',
    role: user.role,
    active: user.active ?? true,
    avatar: resolveMediaUrl(user.avatar),
    locale: user.locale,
  };
}

export function mapServiceOrder(order) {
  if (!order) return null;
  const property = order.property || {};
  const client = property.client || order.client || {};

  return {
    id: order.id,
    propertyId: order.propertyId,
    property: property.name || order.propertyName || '—',
    propertyAddress: property.address || order.propertyAddress || '',
    propertyPhoto: resolveMediaUrl(property.metadata?.photo || property.photo),
    propertyLat: property.latitude != null ? Number(property.latitude) : null,
    propertyLong: property.longitude != null ? Number(property.longitude) : null,
    client: typeof client === 'string' ? client : client.name || '—',
    status: order.status,
    scheduledDate: order.scheduledDate,
    scheduledTime: order.metadata?.scheduledTime || order.scheduledTime,
    startedAt: order.startedAt,
    finishedAt: order.finishedAt,
    checkinLat: order.checkinLat != null ? Number(order.checkinLat) : null,
    checkinLong: order.checkinLong != null ? Number(order.checkinLong) : null,
    checkoutLat: order.checkoutLat != null ? Number(order.checkoutLat) : null,
    checkoutLong: order.checkoutLong != null ? Number(order.checkoutLong) : null,
    beforePhotos: (order.beforePhotos || []).map(resolveMediaUrl),
    afterPhotos: (order.afterPhotos || []).map(resolveMediaUrl),
    totalPrice: Number(order.totalPrice || 0),
    basePrice: Number(order.basePrice || 0),
    extrasTotalPrice: Number(order.extrasTotalPrice || 0),
    extras: (order.extras || []).map((extra) => ({
      id: extra.id || extra.serviceExtraId,
      extraId: extra.serviceExtraId || extra.serviceExtra?.id,
      name: extra.serviceExtra?.name || extra.name,
      defaultPrice: Number(extra.serviceExtra?.defaultPrice || extra.price || 0),
      estimatedTime: extra.serviceExtra?.estimatedTime || extra.estimatedTime,
    })),
    geofenceRadiusM: 200,
  };
}

export function mapServiceExtra(extra) {
  if (!extra) return null;
  return {
    id: extra.id,
    name: extra.name,
    description: extra.description,
    defaultPrice: Number(extra.defaultPrice || 0),
    estimatedTime: extra.estimatedTime,
    active: extra.active ?? true,
  };
}

export function mapInventoryItem(item) {
  if (!item) return null;
  const quantity = Number(item.currentQuantity ?? item.quantity ?? 0);
  const minQuantity = Number(item.criticalLevel ?? item.minQuantity ?? 0);
  let status = 'ok';
  if (item.is_critical || quantity <= minQuantity) status = 'critical';
  else if (quantity <= minQuantity * 1.5) status = 'low';

  return {
    id: item.id,
    propertyId: item.propertyId,
    property: item.property?.name || item.propertyName || '—',
    item: item.name || item.item,
    quantity,
    minQuantity,
    unit: item.unit || 'un.',
    status,
  };
}
