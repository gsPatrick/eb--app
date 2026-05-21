import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';
import EBText from '../atoms/Text';
import { useFormatters } from '../../hooks/useFormatters';
import { openDirections } from '../../utils/maps';
import { colors, radius, shadows, spacing } from '../../theme/variables';

export default function OrderCard({ order, onPress, onNavigate }) {
  const { t } = useTranslation();
  const { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusVariant } = useFormatters();
  const statusVariant = getOrderStatusVariant(order.status);

  const openMaps = () => {
    openDirections(order.propertyAddress);
    onNavigate?.(order);
  };

  return (
    <Pressable onPress={() => onPress?.(order)} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <EBText variant="heading">{order.property}</EBText>
          <EBText variant="caption" color="secondary" style={styles.address}>
            {order.propertyAddress}
          </EBText>
        </View>
        <Badge variant={statusVariant}>{getOrderStatusLabel(order.status)}</Badge>
      </View>

      <View style={styles.metaRow}>
        <EBText variant="caption" color="secondary">
          {t('common.client')}: {order.client}
        </EBText>
        <EBText variant="caption" color="brand">
          {formatCurrency(order.totalPrice)}
        </EBText>
      </View>

      <View style={styles.metaRow}>
        <EBText variant="caption" color="secondary">
          {formatDate(order.scheduledDate)}
          {order.scheduledTime ? ` · ${order.scheduledTime}` : ''}
        </EBText>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={openMaps} style={styles.mapBtn}>
          <MapPin size={16} color={colors.primary} />
          <EBText variant="caption" color="brand">
            {t('schedule.openMaps')}
          </EBText>
        </Pressable>
        <Button size="sm" onPress={() => onPress?.(order)}>
          {order.status === 'in_progress' ? t('schedule.continue') : t('schedule.start')}
        </Button>
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
  pressed: { opacity: 0.96, transform: [{ scale: 0.995 }] },
  header: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  headerText: { flex: 1 },
  address: { marginTop: 4 },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  mapBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
