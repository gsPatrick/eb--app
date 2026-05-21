import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import Button from '../atoms/Button';
import EBText from '../atoms/Text';
import { colors, radius, shadows, spacing } from '../../theme/variables';

export default function GeofenceAlert({ visible, distanceMeters, radiusMeters = 200, onDismiss }) {
  const { t } = useTranslation();

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onDismiss}>
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <Pressable style={styles.panel} onPress={(e) => e.stopPropagation()}>
          <View style={styles.iconWrap}>
            <MapPin size={28} color={colors.primary} />
          </View>
          <EBText variant="heading" style={styles.title}>
            {t('execution.geofenceTitle')}
          </EBText>
          <EBText variant="body" color="secondary" style={styles.description}>
            {t('execution.geofenceDescription', { radius: radiusMeters })}
          </EBText>
          <View style={styles.distanceBadge}>
            <EBText variant="bodyMedium" color="brand">
              {t('execution.geofenceDistance', { distance: Math.round(distanceMeters || 0) })}
            </EBText>
          </View>
          <Button fullWidth onPress={onDismiss}>
            {t('execution.geofenceDismiss')}
          </Button>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  panel: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    ...shadows.glow,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.errorSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { textAlign: 'center', marginBottom: spacing.sm },
  description: { textAlign: 'center', lineHeight: 22 },
  distanceBadge: {
    marginVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
  },
});
