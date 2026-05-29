import React, { useCallback, useEffect } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import EBText from '../components/atoms/Text';
import HistoryOrderCard from '../components/molecules/HistoryOrderCard';
import NotificationBellButton from '../components/molecules/NotificationBellButton';
import ScheduleSkeletonList from '../components/molecules/ScheduleSkeletonList';
import { useRealtime } from '../context/RealtimeContext';
import { useApi } from '../hooks/useApi';
import * as ordersApi from '../api/orders';
import { colors, spacing } from '../theme/variables';

async function fetchCompletedOrders() {
  const result = await ordersApi.list({ status: 'completed', limit: 100 });
  const items = [...result.items];
  items.sort((a, b) => new Date(b.finishedAt || b.scheduledDate) - new Date(a.finishedAt || a.scheduledDate));
  return items;
}

export default function ClientHistoryScreen({ navigation }) {
  const { t } = useTranslation();
  const { subscribe } = useRealtime();

  const fetchHistory = useCallback(fetchCompletedOrders, []);
  const { data: orders, loading, refetch } = useApi(fetchHistory, [], { initialData: [] });

  useEffect(() => subscribe('history', refetch), [subscribe, refetch]);

  if (loading && !orders?.length) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScheduleSkeletonList count={4} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <View style={styles.headerText}>
                <EBText variant="title" color="brand">
                  {t('client.history.title')}
                </EBText>
                <EBText variant="caption" color="secondary" style={styles.sub}>
                  {t('client.history.subtitle')}
                </EBText>
              </View>
              <NotificationBellButton
                onPress={() => navigation.getParent()?.navigate('ProfileTab', { screen: 'Notifications' })}
              />
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <EBText variant="heading" color="secondary">
              {t('client.history.emptyTitle')}
            </EBText>
          </View>
        }
        renderItem={({ item }) => (
          <HistoryOrderCard
            order={item}
            subtitle={item.provider ? t('client.history.providerLabel', { name: item.provider }) : undefined}
            onPress={() => navigation.navigate('HistoryDetail', { orderId: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.xxl, paddingBottom: 120 },
  header: { marginBottom: spacing.lg },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md },
  headerText: { flex: 1 },
  sub: { marginTop: spacing.xs },
  empty: { alignItems: 'center', paddingVertical: 48 },
});
