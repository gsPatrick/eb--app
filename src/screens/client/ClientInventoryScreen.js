import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import EBText from '../components/atoms/Text';
import NotificationBellButton from '../components/molecules/NotificationBellButton';
import InventoryItemRow from '../components/molecules/InventoryItemRow';
import InventorySkeletonList from '../components/molecules/InventorySkeletonList';
import { useRealtime } from '../context/RealtimeContext';
import { useApi } from '../hooks/useApi';
import * as inventoryApi from '../api/inventory';
import * as propertiesApi from '../api/properties';
import { colors, radius, spacing } from '../theme/variables';

function sortInventory(items) {
  const priority = { critical: 0, low: 1, ok: 2 };
  return [...items].sort((a, b) => (priority[a.status] ?? 3) - (priority[b.status] ?? 3));
}

export default function ClientInventoryScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const { subscribe } = useRealtime();
  const [propertyFilter, setPropertyFilter] = useState('all');

  const fetchData = useCallback(async () => {
    const [{ items }, { items: properties }] = await Promise.all([
      inventoryApi.list({ limit: 100 }),
      propertiesApi.list(),
    ]);
    return { items: sortInventory(items), properties };
  }, []);

  const { data, loading, refetch } = useApi(fetchData, [], {
    initialData: { items: [], properties: [] },
  });

  useEffect(() => subscribe('inventory', refetch), [subscribe, refetch]);

  const filteredItems = useMemo(() => {
    if (propertyFilter === 'all') return data.items;
    return data.items.filter((item) => item.propertyId === propertyFilter);
  }, [data.items, propertyFilter]);

  const formatQuantity = useCallback(
    (quantity, unit, minQuantity) =>
      t('inventory.quantityLabel', { quantity, unit, min: minQuantity }),
    [t, i18n.language]
  );

  const getStatusLabel = useCallback((status) => t(`inventory.status.${status}`), [t, i18n.language]);

  if (loading && !data.items.length) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <InventorySkeletonList count={4} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <View style={styles.headerText}>
                <EBText variant="title" color="brand">
                  {t('client.inventory.title')}
                </EBText>
                <EBText variant="caption" color="secondary" style={styles.sub}>
                  {t('client.inventory.subtitle')}
                </EBText>
              </View>
              <NotificationBellButton
                onPress={() => navigation.getParent()?.navigate('ProfileTab', { screen: 'Notifications' })}
              />
            </View>
            <View style={styles.filters}>
              <Pressable
                style={[styles.chip, propertyFilter === 'all' && styles.chipActive]}
                onPress={() => setPropertyFilter('all')}
              >
                <EBText variant="caption" color={propertyFilter === 'all' ? 'brand' : 'secondary'}>
                  {t('client.inventory.allProperties')}
                </EBText>
              </Pressable>
              {data.properties.map((property) => (
                <Pressable
                  key={property.id}
                  style={[styles.chip, propertyFilter === property.id && styles.chipActive]}
                  onPress={() => setPropertyFilter(property.id)}
                >
                  <EBText
                    variant="caption"
                    color={propertyFilter === property.id ? 'brand' : 'secondary'}
                    numberOfLines={1}
                  >
                    {property.name}
                  </EBText>
                </Pressable>
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <EBText variant="heading" color="secondary">
              {t('client.inventory.emptyTitle')}
            </EBText>
          </View>
        }
        renderItem={({ item }) => (
          <InventoryItemRow
            item={item}
            editable={false}
            formatQuantity={formatQuantity}
            statusLabel={getStatusLabel(item.status)}
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
  sub: { marginTop: spacing.xs, marginBottom: spacing.md },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.bgMuted,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: '100%',
  },
  chipActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  empty: { alignItems: 'center', paddingVertical: 48 },
});
