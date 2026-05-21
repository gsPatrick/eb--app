import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Camera, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import Badge from '../atoms/Badge';
import EBText from '../atoms/Text';
import { useFormatters } from '../../hooks/useFormatters';
import { colors, radius, shadows, spacing } from '../../theme/variables';

export default function HistoryOrderCard({ order, onPress }) {
  const { t } = useTranslation();
  const { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusVariant } = useFormatters();
  const photoCount = (order.beforePhotos?.length || 0) + (order.afterPhotos?.length || 0);
  const previewPhoto = order.afterPhotos?.[0] || order.beforePhotos?.[0] || order.propertyPhoto;

  return (
    <Pressable onPress={() => onPress?.(order)} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.header}>
        {previewPhoto ? (
          <Image source={{ uri: previewPhoto }} style={styles.previewImage} />
        ) : (
          <View style={styles.previewPlaceholder}>
            <Camera size={18} color={colors.textMuted} />
          </View>
        )}
        <View style={styles.flex}>
          <EBText variant="heading">{order.property}</EBText>
          <EBText variant="caption" color="secondary" style={styles.address} numberOfLines={2}>
            {order.propertyAddress}
          </EBText>
          <EBText variant="caption" color="secondary" style={styles.date}>
            {formatDate(order.finishedAt || order.scheduledDate)}
          </EBText>
        </View>
        <Badge variant={getOrderStatusVariant(order.status)}>{getOrderStatusLabel(order.status)}</Badge>
      </View>

      <View style={styles.metaRow}>
        <EBText variant="caption" color="secondary">
          {t('history.basePlusExtras')}
        </EBText>
        <EBText variant="bodyMedium" color="brand">
          {formatCurrency(order.totalPrice)}
        </EBText>
      </View>

      <View style={styles.footer}>
        <View style={styles.photoHint}>
          <Camera size={14} color={colors.textMuted} />
          <EBText variant="caption" color="muted">
            {photoCount > 0
              ? t('history.photoCount', { count: photoCount })
              : t('history.noPhotos')}
          </EBText>
        </View>
        <View style={styles.viewDetails}>
          <EBText variant="caption" color="brand">
            {t('history.viewDetails')}
          </EBText>
          <ChevronRight size={18} color={colors.primary} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  pressed: { opacity: 0.96 },
  header: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  previewImage: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.bgMuted,
  },
  previewPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
  address: { marginTop: 4, lineHeight: 18 },
  date: { marginTop: 4 },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  photoHint: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  viewDetails: { flexDirection: 'row', alignItems: 'center', gap: 2 },
});
