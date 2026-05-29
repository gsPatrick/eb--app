import React, { useCallback, useEffect, useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import OrderCard from '../components/molecules/OrderCard';
import NotificationBellButton from '../components/molecules/NotificationBellButton';
import ScheduleSkeletonList from '../components/molecules/ScheduleSkeletonList';
import EBText from '../components/atoms/Text';
import { useRealtime } from '../context/RealtimeContext';
import { useApi } from '../hooks/useApi';
import * as ordersApi from '../api/orders';
import { colors, spacing } from '../theme/variables';

function isToday(dateStr) {
  const today = new Date().toISOString().slice(0, 10);
  return dateStr === today;
}

export default function ScheduleScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const { subscribe } = useRealtime();

  const fetchSchedule = useCallback(async () => {
    const { items } = await ordersApi.list({ limit: 50 });
    return items.filter(
      (order) =>
        ['pending', 'in_progress'].includes(order.status) && isToday(order.scheduledDate)
    );
  }, []);

  const { data: orders, loading, refetch } = useApi(fetchSchedule, [], { initialData: [] });

  useEffect(() => subscribe('schedule', refetch), [subscribe, refetch]);

  const header = useMemo(
    () => (
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <EBText variant="title" color="brand">
              {t('schedule.title')}
            </EBText>
            <EBText variant="caption" color="secondary" style={styles.sub}>
              {t('schedule.subtitle')}
            </EBText>
          </View>
          <NotificationBellButton onPress={() => navigation.navigate('Notifications')} />
        </View>
      </View>
    ),
    [t, i18n.language, navigation]
  );

  if (loading && !orders?.length) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.container}>
          <ScheduleSkeletonList count={3} />
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
              {t('schedule.emptyTitle')}
            </EBText>
            <EBText variant="caption" color="muted" style={styles.emptySub}>
              {t('schedule.emptySubtitle')}
            </EBText>
          </View>
        }
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() => navigation.navigate('Execution', { orderId: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.xxl, paddingBottom: 100 },
  header: { marginBottom: spacing.xl },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  headerText: { flex: 1, paddingRight: spacing.md },
  sub: { marginTop: spacing.xs },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptySub: { marginTop: spacing.sm, textAlign: 'center' },
});
