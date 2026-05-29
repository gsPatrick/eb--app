import React, { useCallback, useMemo } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react-native';
import EBText from '../../components/atoms/Text';
import { useApi } from '../../hooks/useApi';
import { useFormatters } from '../../hooks/useFormatters';
import * as ordersApi from '../../api/orders';
import { colors, radius, shadows, spacing } from '../../theme/variables';

function isInMonth(dateStr, year, month) {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  return date.getFullYear() === year && date.getMonth() === month;
}

export default function ClientBillingScreen({ navigation }) {
  const { t } = useTranslation();
  const { formatCurrency, formatDate } = useFormatters();

  const fetchOrders = useCallback(
    () => ordersApi.list({ status: 'completed', limit: 100 }).then((result) => result.items),
    []
  );
  const { data: orders, loading, refetch } = useApi(fetchOrders, [], { initialData: [] });

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const previousMonthDate = new Date(currentYear, currentMonth - 1, 1);

  const currentMonthTotal = useMemo(
    () =>
      orders
        .filter((order) => isInMonth(order.finishedAt || order.scheduledDate, currentYear, currentMonth))
        .reduce((sum, order) => sum + Number(order.totalPrice || 0), 0),
    [orders, currentYear, currentMonth]
  );

  const previousMonthTotal = useMemo(
    () =>
      orders
        .filter((order) =>
          isInMonth(order.finishedAt || order.scheduledDate, previousMonthDate.getFullYear(), previousMonthDate.getMonth())
        )
        .reduce((sum, order) => sum + Number(order.totalPrice || 0), 0),
    [orders, previousMonthDate]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={20} color={colors.primary} />
              <EBText variant="caption" color="brand">
                {t('common.back')}
              </EBText>
            </Pressable>
            <EBText variant="title" color="brand">
              {t('client.billing.title')}
            </EBText>
            <EBText variant="caption" color="secondary" style={styles.sub}>
              {t('client.billing.subtitle')}
            </EBText>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <EBText variant="caption" color="secondary">
                  {t('client.billing.currentMonth')}
                </EBText>
                <EBText variant="heading" color="brand">
                  {formatCurrency(currentMonthTotal)}
                </EBText>
              </View>
              <View style={styles.statCard}>
                <EBText variant="caption" color="secondary">
                  {t('client.billing.previousMonth')}
                </EBText>
                <EBText variant="heading" color="brand">
                  {formatCurrency(previousMonthTotal)}
                </EBText>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <EBText variant="heading" color="secondary">
              {t('client.billing.emptyTitle')}
            </EBText>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.flex}>
              <EBText variant="bodyMedium">{item.property}</EBText>
              <EBText variant="caption" color="secondary">
                {formatDate(item.finishedAt || item.scheduledDate)}
                {item.provider ? ` · ${item.provider}` : ''}
              </EBText>
            </View>
            <EBText variant="bodyMedium" color="brand">
              {formatCurrency(item.totalPrice)}
            </EBText>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.xxl, paddingBottom: 48 },
  header: { marginBottom: spacing.lg },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.lg },
  sub: { marginTop: spacing.xs, marginBottom: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.md },
  statCard: {
    flex: 1,
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  flex: { flex: 1, paddingRight: spacing.md },
  empty: { alignItems: 'center', paddingVertical: 48 },
});
