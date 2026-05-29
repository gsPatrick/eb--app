import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Button from '../../components/atoms/Button';
import EBText from '../../components/atoms/Text';
import Badge from '../../components/atoms/Badge';
import NotificationBellButton from '../../components/molecules/NotificationBellButton';
import { useApi } from '../hooks/useApi';
import { useFormatters } from '../hooks/useFormatters';
import { useRealtime } from '../context/RealtimeContext';
import * as ordersApi from '../api/orders';
import { colors, radius, spacing } from '../theme/variables';

function canRequestExtras(order) {
  if (order.status !== 'pending') return false;
  const scheduled = new Date(`${order.scheduledDate}T00:00:00`);
  const deadline = new Date(scheduled.getTime() - 24 * 60 * 60 * 1000);
  return Date.now() <= deadline.getTime();
}

export default function ClientOrdersScreen({ navigation }) {
  const { t } = useTranslation();
  const { formatCurrency, formatDate } = useFormatters();
  const [requestingId, setRequestingId] = useState(null);

  const fetchData = useCallback(async () => {
    const [ordersRes, extrasRes] = await Promise.all([
      ordersApi.list({ status: 'pending', limit: 100 }),
      ordersApi.listExtras({ limit: 100 }),
    ]);
    return { orders: ordersRes.items, extras: extrasRes.items };
  }, []);

  const { data, loading, refetch } = useApi(fetchData, []);
  const { subscribe } = useRealtime();

  React.useEffect(() => subscribe('orders', refetch), [subscribe, refetch]);

  const orders = data?.orders ?? [];
  const extras = data?.extras ?? [];

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => String(a.scheduledDate).localeCompare(String(b.scheduledDate))),
    [orders]
  );

  const handleRequestExtra = async (order, extraId) => {
    setRequestingId(`${order.id}:${extraId}`);
    try {
      await ordersApi.requestExtra(order.id, extraId);
      await refetch();
      Alert.alert(t('client.orders.extraRequested'), t('client.orders.extraRequestedMessage'));
    } catch (error) {
      Alert.alert(t('common.error'), error.message || t('common.error'));
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <EBText variant="title">{t('client.orders.title')}</EBText>
            <EBText variant="body" color="secondary" style={styles.subtitle}>
              {t('client.orders.subtitle')}
            </EBText>
          </View>
          <NotificationBellButton
            onPress={() => navigation.getParent()?.navigate('ProfileTab', { screen: 'Notifications' })}
          />
        </View>

        {loading ? (
          <EBText variant="body" color="secondary">
            {t('common.loading')}
          </EBText>
        ) : sortedOrders.length === 0 ? (
          <EBText variant="body" color="secondary">
            {t('client.orders.emptyTitle')}
          </EBText>
        ) : (
          sortedOrders.map((order) => {
            const canRequest = canRequestExtras(order);
            const attachedIds = new Set((order.extras || []).map((item) => item.id || item.serviceExtraId));

            return (
              <View key={order.id} style={styles.card}>
                <EBText variant="heading">{order.property}</EBText>
                <EBText variant="caption" color="secondary">
                  {formatDate(order.scheduledDate)}
                </EBText>
                {order.cleaningType ? (
                  <EBText variant="caption" color="brand">
                    {t(`cleaningTypes.${order.cleaningType}`, order.cleaningType)}
                  </EBText>
                ) : null}

                <View style={styles.extrasBlock}>
                  <EBText variant="bodyMedium">{t('client.orders.extrasTitle')}</EBText>
                  {extras.map((extra) => {
                    const isAttached = attachedIds.has(extra.id);
                    const loadingThis = requestingId === `${order.id}:${extra.id}`;

                    return (
                      <View key={`${order.id}:${extra.id}`} style={styles.extraRow}>
                        <View style={styles.extraInfo}>
                          <EBText variant="body">{extra.name}</EBText>
                          <EBText variant="caption" color="secondary">
                            {formatCurrency(extra.defaultPrice)}
                          </EBText>
                        </View>
                        {isAttached ? (
                          <Badge variant="success">{t('client.orders.requestedByYou')}</Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            loading={loadingThis}
                            disabled={!canRequest || loadingThis}
                            onPress={() => handleRequestExtra(order, extra.id)}
                          >
                            {t('client.orders.requestExtra')}
                          </Button>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.lg, gap: spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md },
  headerText: { flex: 1 },
  subtitle: { marginBottom: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  extrasBlock: { marginTop: spacing.sm, gap: spacing.sm },
  extraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  extraInfo: { flex: 1 },
});
