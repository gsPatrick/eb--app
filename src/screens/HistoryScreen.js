import React, { useCallback, useEffect, useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import HistoryEarningsCard from '../components/molecules/HistoryEarningsCard';
import HistoryOrderCard from '../components/molecules/HistoryOrderCard';
import ScheduleSkeletonList from '../components/molecules/ScheduleSkeletonList';
import EBText from '../components/atoms/Text';
import { useRealtime } from '../context/RealtimeContext';
import { useApi } from '../hooks/useApi';
import { useFormatters } from '../hooks/useFormatters';
import * as ordersApi from '../api/orders';
import { colors, spacing } from '../theme/variables';

async function fetchCompletedOrders() {
  const [completed, billed] = await Promise.all([
    ordersApi.list({ status: 'completed', limit: 100 }),
    ordersApi.list({ status: 'billed', limit: 100 }),
  ]);

  const merged = [...completed.items, ...billed.items];
  merged.sort((a, b) => new Date(b.finishedAt || b.scheduledDate) - new Date(a.finishedAt || a.scheduledDate));
  return merged;
}

export default function HistoryScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const { formatCurrency } = useFormatters();
  const { subscribe } = useRealtime();

  const fetchHistory = useCallback(fetchCompletedOrders, []);
  const { data: orders, loading, refetch } = useApi(fetchHistory, [], { initialData: [] });

  useEffect(() => subscribe('history', refetch), [subscribe, refetch]);

  const totalEarned = useMemo(
    () => (orders || []).reduce((sum, order) => sum + Number(order.totalPrice || 0), 0),
    [orders]
  );

  const header = useMemo(
    () => (
      <View style={styles.header}>
        <EBText variant="title" color="brand">
          {t('history.title')}
        </EBText>
        <EBText variant="caption" color="secondary" style={styles.sub}>
          {t('history.subtitle')}
        </EBText>
        <HistoryEarningsCard
          total={formatCurrency(totalEarned)}
          orderCount={orders?.length || 0}
        />
      </View>
    ),
    [t, i18n.language, formatCurrency, totalEarned, orders?.length]
  );

  if (loading && !orders?.length) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.container}>
          <ScheduleSkeletonList count={4} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        ListHeaderComponent={header}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <EBText variant="heading" color="secondary">
              {t('history.emptyTitle')}
            </EBText>
            <EBText variant="caption" color="muted" style={styles.emptySub}>
              {t('history.emptySubtitle')}
            </EBText>
          </View>
        }
        renderItem={({ item }) => (
          <HistoryOrderCard
            order={item}
            onPress={() => navigation.navigate('HistoryDetail', { orderId: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.xxl, paddingBottom: 100 },
  header: { marginBottom: spacing.md },
  sub: { marginTop: spacing.xs, marginBottom: spacing.lg },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptySub: { marginTop: spacing.sm, textAlign: 'center' },
});
