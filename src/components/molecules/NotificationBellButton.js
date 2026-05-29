import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Bell } from 'lucide-react-native';
import EBText from '../atoms/Text';
import { useRealtime } from '../../context/RealtimeContext';
import * as notificationsApi from '../../api/notifications';
import { colors, radius, spacing } from '../../theme/variables';

export default function NotificationBellButton({ onPress }) {
  const { subscribe } = useRealtime();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchCount = useCallback(async () => {
    try {
      const count = await notificationsApi.getUnreadCount();
      setUnreadCount(count);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  useEffect(() => subscribe('notifications', fetchCount), [subscribe, fetchCount]);

  return (
    <Pressable onPress={onPress} style={styles.button} hitSlop={8}>
      <Bell size={22} color={colors.primary} />
      {unreadCount > 0 ? (
        <View style={styles.badge}>
          <EBText variant="caption" color="inverse" style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </EBText>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: spacing.xs, position: 'relative' },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 18,
    height: 18,
    borderRadius: radius.full,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { fontSize: 10, lineHeight: 12, fontWeight: '700' },
});
