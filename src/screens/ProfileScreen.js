import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { FileText, Bell, MessageCircle, Package, Receipt, Settings } from 'lucide-react-native';
import Button from '../components/atoms/Button';
import EBText from '../components/atoms/Text';
import { useAuth } from '../context/AuthContext';
import { colors, radius, shadows, spacing } from '../theme/variables';

export default function ProfileScreen({ navigation }) {
  const { t } = useTranslation();
  const { user, signOut, isClient } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      await signOut();
    } finally {
      setLoggingOut(false);
    }
  };

  const menuItems = useMemo(() => {
    if (isClient) {
      return [
        { key: 'notifications', icon: Bell, label: t('notifications.title'), route: 'Notifications' },
        { key: 'contracts', icon: FileText, label: t('client.profile.contracts'), route: 'Contracts' },
        { key: 'billing', icon: Receipt, label: t('client.profile.billing'), route: 'Billing' },
        { key: 'messages', icon: MessageCircle, label: t('client.profile.messages'), route: 'Messages' },
        { key: 'settings', icon: Settings, label: t('profile.settings'), route: 'Settings' },
      ];
    }

    return [
      { key: 'notifications', icon: Bell, label: t('notifications.title'), route: 'Notifications' },
      { key: 'messages', icon: MessageCircle, label: t('provider.messages.title'), route: 'Messages' },
      { key: 'inventory', icon: Package, label: t('profile.inventory'), route: 'Inventory' },
      { key: 'settings', icon: Settings, label: t('profile.settings'), route: 'Settings' },
    ];
  }, [isClient, t]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.avatar}>
            <EBText variant="title" color="inverse">
              {user?.firstName?.charAt(0) || 'P'}
            </EBText>
          </View>
          <EBText variant="heading">{user?.name}</EBText>
          <EBText variant="caption" color="secondary">
            {user?.email}
          </EBText>
          <EBText variant="caption" color="brand" style={styles.role}>
            {isClient ? t('profile.clientRole') : t('profile.role')}
          </EBText>
        </View>

        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Pressable
              key={item.key}
              style={styles.menuRow}
              onPress={() => navigation.navigate(item.route)}
            >
              <Icon size={20} color={colors.primary} />
              <EBText variant="bodyMedium" color="brand">
                {item.label}
              </EBText>
            </Pressable>
          );
        })}

        <Button
          variant="secondary"
          fullWidth
          loading={loggingOut}
          disabled={loggingOut}
          onPress={handleLogout}
          style={styles.logout}
        >
          {t('profile.logout')}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.xxl },
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.card,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  role: { marginTop: spacing.sm, fontWeight: '600' },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logout: { marginTop: spacing.lg },
});
