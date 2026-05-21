import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react-native';
import EBText from '../components/atoms/Text';
import InventoryItemRow from '../components/molecules/InventoryItemRow';
import InventorySkeletonList from '../components/molecules/InventorySkeletonList';
import { useRealtime } from '../context/RealtimeContext';
import { useApi } from '../hooks/useApi';
import * as inventoryApi from '../api/inventory';
import * as ordersApi from '../api/orders';
import { colors, spacing } from '../theme/variables';

function isToday(dateStr) {
  const today = new Date().toISOString().slice(0, 10);
  return dateStr === today;
}

function sortInventory(items) {
  const priority = { critical: 0, low: 1, ok: 2 };
  return [...items].sort(
    (a, b) => (priority[a.status] ?? 3) - (priority[b.status] ?? 3)
  );
}

export default function InventoryScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const { subscribe } = useRealtime();
  const [savingId, setSavingId] = useState(null);

  const fetchInventoryContext = useCallback(async () => {
    const [{ items }, { items: orders }] = await Promise.all([
      inventoryApi.list({ limit: 100 }),
      ordersApi.list({ limit: 50 }),
    ]);

    const editablePropertyIds = new Set(
      orders
        .filter(
          (order) =>
            ['pending', 'in_progress'].includes(order.status) && isToday(order.scheduledDate)
        )
        .map((order) => order.propertyId)
        .filter(Boolean)
    );

    return {
      items: sortInventory(items),
      editablePropertyIds,
    };
  }, []);

  const { data, loading, refetch, setData } = useApi(fetchInventoryContext, [], {
    initialData: { items: [], editablePropertyIds: new Set() },
  });

  const items = data?.items ?? [];
  const editablePropertyIds = data?.editablePropertyIds ?? new Set();
  const hasEditableItems = items.some((item) => editablePropertyIds.has(item.propertyId));

  useEffect(() => subscribe('inventory', refetch), [subscribe, refetch]);
  useEffect(() => subscribe('schedule', refetch), [subscribe, refetch]);

  const criticalCount = useMemo(
    () => items.filter((item) => item.status === 'critical').length,
    [items]
  );

  const formatQuantity = useCallback(
    (quantity, unit, minQuantity) =>
      t('inventory.quantityLabel', { quantity, unit, min: minQuantity }),
    [t, i18n.language]
  );

  const getStatusLabel = useCallback(
    (status) => t(`inventory.status.${status}`),
    [t, i18n.language]
  );

  const handleSaveQuantity = useCallback(
    async (item, nextQuantity) => {
      setSavingId(item.id);
      try {
        const updated = await inventoryApi.updateQuantity(item.id, nextQuantity);
        setData((prev) => ({
          ...prev,
          items: sortInventory(
            prev.items.map((entry) => (entry.id === item.id ? updated : entry))
          ),
        }));
      } catch (error) {
        const message =
          error.code === 'FORBIDDEN' || error.status === 403
            ? t('inventory.readOnlyHint')
            : error.message || t('inventory.updateError');
        Alert.alert(t('common.error'), message);
      } finally {
        setSavingId(null);
      }
    },
    [setData, t, i18n.language]
  );

  const header = useMemo(
    () => (
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={20} color={colors.primary} />
          <EBText variant="caption" color="brand">
            {t('common.back')}
          </EBText>
        </Pressable>
        <EBText variant="title" color="brand">
          {t('inventory.title')}
        </EBText>
        <EBText variant="caption" color="secondary" style={styles.sub}>
          {t('inventory.subtitle')}
        </EBText>
        {criticalCount > 0 ? (
          <View style={styles.alertBanner}>
            <EBText variant="caption" color="error">
              {t('inventory.criticalAlert', { count: criticalCount })}
            </EBText>
          </View>
        ) : null}
        {items.length > 0 && !hasEditableItems ? (
          <View style={styles.infoBanner}>
            <EBText variant="caption" color="secondary">
              {t('inventory.readOnlyHint')}
            </EBText>
          </View>
        ) : null}
        {hasEditableItems ? (
          <View style={styles.infoBanner}>
            <EBText variant="caption" color="brand">
              {t('inventory.editableHint')}
            </EBText>
          </View>
        ) : null}
      </View>
    ),
    [t, i18n.language, navigation, criticalCount, items.length, hasEditableItems]
  );

  if (loading && !items.length) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.container}>
          <InventorySkeletonList count={6} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        ListHeaderComponent={header}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <EBText variant="heading" color="secondary">
              {t('inventory.emptyTitle')}
            </EBText>
            <EBText variant="caption" color="muted" style={styles.emptySub}>
              {t('inventory.emptySubtitle')}
            </EBText>
          </View>
        }
        renderItem={({ item }) => (
          <InventoryItemRow
            item={item}
            formatQuantity={formatQuantity}
            statusLabel={getStatusLabel(item.status)}
            editable={editablePropertyIds.has(item.propertyId)}
            saving={savingId === item.id}
            onSave={(quantity) => handleSaveQuantity(item, quantity)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.xxl, paddingBottom: 100 },
  header: { marginBottom: spacing.lg },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.lg },
  sub: { marginTop: spacing.xs },
  alertBanner: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.errorSoft,
  },
  infoBanner: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.bgMuted,
  },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptySub: { marginTop: spacing.sm, textAlign: 'center' },
});
