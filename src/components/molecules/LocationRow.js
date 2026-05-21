import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import EBText from '../atoms/Text';
import { useReverseGeocode } from '../../hooks/useReverseGeocode';
import { colors, radius, spacing } from '../../theme/variables';

export default function LocationRow({ title, latitude, longitude }) {
  const { t } = useTranslation();
  const { label, loading, coords } = useReverseGeocode(latitude, longitude);

  if (latitude == null || longitude == null) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.titleRow}>
        <MapPin size={16} color={colors.primary} />
        <EBText variant="caption" color="secondary">
          {title}
        </EBText>
      </View>
      <EBText variant="bodyMedium" style={styles.label}>
        {loading ? t('common.loading') : label || t('location.unknownAddress')}
      </EBText>
      <EBText variant="caption" color="muted">
        {t('location.coordinates')}: {coords}
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
    gap: 4,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { lineHeight: 20 },
});
