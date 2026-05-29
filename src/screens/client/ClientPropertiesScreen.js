import React, { useCallback, useEffect } from 'react';
import { FlatList, Image, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Building2 } from 'lucide-react-native';
import NotificationBellButton from '../../components/molecules/NotificationBellButton';
import EBText from '../../components/atoms/Text';
import ScheduleSkeletonList from '../../components/molecules/ScheduleSkeletonList';
import { useRealtime } from '../../context/RealtimeContext';
import { useApi } from '../../hooks/useApi';
import { useFormatters } from '../../hooks/useFormatters';
import * as propertiesApi from '../../api/properties';
import { colors, radius, shadows, spacing } from '../theme/variables';

function statusMeta(cleanStatus, t) {
  if (cleanStatus === 'clean') {
    return { label: t('client.properties.statusClean'), badge: styles.badgeSuccess, icon: styles.iconSuccess };
  }
  if (cleanStatus === 'dirty') {
    return { label: t('client.properties.statusDirty'), badge: styles.badgeWarning, icon: styles.iconWarning };
  }
  return { label: t('client.properties.statusScheduled'), badge: styles.badgeInfo, icon: styles.iconInfo };
}

export default function ClientPropertiesScreen({ navigation }) {
  const { t } = useTranslation();
  const { formatDate } = useFormatters();
  const { subscribe } = useRealtime();

  const fetchProperties = useCallback(
    () => propertiesApi.list().then((result) => result.items),
    []
  );
  const { data: properties, loading, refetch } = useApi(fetchProperties, [], { initialData: [] });

  useEffect(() => subscribe('properties', refetch), [subscribe, refetch]);

  if (loading && !properties?.length) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScheduleSkeletonList count={3} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <View style={styles.headerText}>
                <EBText variant="title" color="brand">
                  {t('client.properties.title')}
                </EBText>
                <EBText variant="caption" color="secondary" style={styles.sub}>
                  {t('client.properties.subtitle')}
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
              {t('client.properties.emptyTitle')}
            </EBText>
          </View>
        }
        renderItem={({ item }) => {
          const meta = statusMeta(item.cleanStatus, t);
          return (
            <View style={styles.card}>
              {item.photo ? (
                <Image source={{ uri: item.photo }} style={styles.photo} />
              ) : (
                <View style={[styles.photo, styles.photoPlaceholder]}>
                  <Building2 size={28} color={colors.primary} />
                </View>
              )}
              <View style={styles.cardBody}>
                <EBText variant="heading">{item.name}</EBText>
                <EBText variant="caption" color="secondary" style={styles.address}>
                  {item.address}
                </EBText>
                <View style={[styles.badge, meta.badge]}>
                  <EBText variant="caption" style={styles.badgeText}>
                    {meta.label}
                  </EBText>
                </View>
                {item.lastCleaningAt ? (
                  <EBText variant="caption" color="muted" style={styles.meta}>
                    {t('client.properties.lastCleaning')}: {formatDate(item.lastCleaningAt)}
                  </EBText>
                ) : null}
                {item.nextCleaningAt ? (
                  <EBText variant="caption" color="muted">
                    {t('client.properties.nextCleaning')}: {formatDate(item.nextCleaningAt)}
                  </EBText>
                ) : null}
              </View>
            </View>
          );
        }}
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
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  photo: { width: '100%', height: 140 },
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgMuted,
  },
  cardBody: { padding: spacing.lg, gap: spacing.xs },
  address: { lineHeight: 18 },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginTop: spacing.sm,
  },
  badgeSuccess: { backgroundColor: colors.accentSoft },
  badgeWarning: { backgroundColor: colors.warningSoft },
  badgeInfo: { backgroundColor: colors.primarySoft },
  badgeText: { fontWeight: '600', color: colors.textPrimary },
  meta: { marginTop: spacing.sm },
  empty: { alignItems: 'center', paddingVertical: 48 },
});
