import React from 'react';
import {
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { MapPin } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import EBText from '../atoms/Text';
import { useReverseGeocode } from '../../hooks/useReverseGeocode';
import { buildStaticMapUrl, openCoordinatesInMaps } from '../../utils/maps';
import { colors, radius, spacing } from '../../theme/variables';

export default function LocationRow({
  title,
  latitude,
  longitude,
  address,
}) {
  const { t } = useTranslation();
  const hasCoords = latitude != null && longitude != null;
  const { label, loading } = useReverseGeocode(latitude, longitude, hasCoords && !address);
  const placeName = address || label || t('location.unknownAddress');

  if (!hasCoords) {
    return null;
  }

  const lat = Number(latitude);
  const lng = Number(longitude);

  return (
    <View style={styles.wrap}>
      <View style={styles.titleRow}>
        <MapPin size={16} color={colors.primary} />
        <EBText variant="caption" color="secondary">
          {title}
        </EBText>
      </View>
      <Pressable
        onPress={() => openCoordinatesInMaps(lat, lng, placeName)}
        accessibilityRole="button"
        accessibilityLabel={t('location.openInMaps')}
      >
        <Image
          source={{ uri: buildStaticMapUrl(lat, lng) }}
          style={styles.map}
          resizeMode="cover"
        />
      </Pressable>
      <EBText variant="bodyMedium" style={styles.label}>
        {loading && !address ? t('common.loading') : placeName}
      </EBText>
      <EBText variant="caption" color="brand">
        {t('location.openInMaps')}
      </EBText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgMuted,
    gap: spacing.sm,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { lineHeight: 20 },
  map: {
    width: '100%',
    height: 140,
    borderRadius: radius.md,
    backgroundColor: colors.border,
  },
});
