import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
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

  return (
    <Pressable onPress={() => onPress?.(order)} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.header}>
        <View style={styles.flex}>
          <EBText variant="heading">{order.property}</EBText>
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
            {t('history.photoCount', { count: photoCount })}
          </EBText>
        </View>
        <ChevronRight size={18} color={colors.primary} />
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
  header: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  flex: { flex: 1 },
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
});
