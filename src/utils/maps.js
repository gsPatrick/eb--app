import { Linking, Platform } from 'react-native';

export function openDirections(address) {
  const query = encodeURIComponent(address);
  const url = Platform.select({
    ios: `maps:0,0?q=${query}`,
    android: `geo:0,0?q=${query}`,
    default: `https://www.google.com/maps/search/?api=1&query=${query}`,
  });
  return Linking.openURL(url);
}
