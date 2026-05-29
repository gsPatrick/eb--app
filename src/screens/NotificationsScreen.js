import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react-native';
import Badge from '../components/atoms/Badge';
import Button from '../components/atoms/Button';
import EBText from '../components/atoms/Text';
import { useRealtime } from '../context/RealtimeContext';
import { useFormatters } from '../hooks/useFormatters';
import * as notificationsApi from '../api/notifications';
import { colors, radius, spacing } from '../theme/variables';

export default function NotificationsScreen({ navigation }) {
  const { t } = useTranslation();
  const { formatDateTime } = useFormatters();
  const { subscribe } = useRealtime();
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const [listResult, count] = await Promise.all([
        notificationsApi.list({ limit: 50 }),
        notificationsApi.getUnreadCount(),
      ]);
      setItems(listResult.items);
      setUnreadCount(count);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => subscribe('notifications', fetchNotifications), [subscribe, fetchNotifications]);

  const handleMarkRead = async (id) => {
    try {
      const updated = await notificationsApi.markRead(id);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      /* ignore */
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      setItems((prev) =>
        prev.map((item) => ({ ...item, readAt: item.readAt || new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch {
      /* ignore */
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={22} color={colors.primary} />
          <EBText variant="caption" color="brand">
            {t('common.back')}
          </EBText>
        </Pressable>
        <EBText variant="title" color="brand">
          {t('notifications.title')}
        </EBText>
        {unreadCount > 0 ? (
          <Button variant="ghost" size="sm" onPress={handleMarkAllRead}>
            {t('notifications.markAllRead')}
          </Button>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchNotifications} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <EBText variant="body" color="secondary">
                {t('notifications.empty')}
              </EBText>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => !item.readAt && handleMarkRead(item.id)}
            style={[styles.item, !item.readAt && styles.itemUnread]}
          >
            <View style={styles.itemHeader}>
              <EBText variant="bodyMedium">{item.title}</EBText>
              {!item.readAt ? <Badge variant="warning">{t('notifications.unread')}</Badge> : null}
            </View>
            <EBText variant="caption" color="secondary" style={styles.message}>
              {item.message}
            </EBText>
            <EBText variant="caption" color="muted">
              {formatDateTime(item.createdAt)}
            </EBText>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, minWidth: 72 },
  headerSpacer: { minWidth: 72 },
  list: { padding: spacing.xxl, paddingBottom: 100 },
  empty: { alignItems: 'center', paddingVertical: 48 },
  item: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemUnread: { borderColor: colors.primarySoft, backgroundColor: colors.primarySoft + '22' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  message: { marginTop: spacing.sm, marginBottom: spacing.xs },
});
