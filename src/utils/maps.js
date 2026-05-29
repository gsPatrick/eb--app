import { Linking, Platform } from 'react-native';

export function buildStaticMapUrl(latitude, longitude, width = 600, height = 200) {
  const lat = Number(latitude);
  const lng = Number(longitude);
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=16&size=${width}x${height}&markers=${lat},${lng},lightblue1`;
}

export function openCoordinatesInMaps(latitude, longitude, label = '') {
  const lat = Number(latitude);
  const lng = Number(longitude);
  const encodedLabel = encodeURIComponent(label || 'Location');
  const url = Platform.select({
    ios: `maps:0,0?q=${encodedLabel}@${lat},${lng}`,
    android: `geo:${lat},${lng}?q=${lat},${lng}(${encodedLabel})`,
    default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
  });

  Linking.openURL(url);
}

export function openAddressInMaps(address) {
  if (!address) return;
  const encoded = encodeURIComponent(address);
  const url = Platform.select({
    ios: `maps:0,0?q=${encoded}`,
    android: `geo:0,0?q=${encoded}`,
    default: `https://www.google.com/maps/search/?api=1&query=${encoded}`,
  });

  Linking.openURL(url);
}

export function openDirections(address) {
  openAddressInMaps(address);
}
