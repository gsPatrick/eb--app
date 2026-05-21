import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Package, Settings } from 'lucide-react-native';
import Button from '../components/atoms/Button';
import EBText from '../components/atoms/Text';
import { useAuth } from '../context/AuthContext';
import { colors, radius, shadows, spacing } from '../theme/variables';

export default function ProfileScreen({ navigation }) {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();

  const menuItems = [
    { key: 'inventory', icon: Package, label: t('profile.inventory'), route: 'Inventory' },
    { key: 'settings', icon: Settings, label: t('profile.settings'), route: 'Settings' },
  ];

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
            {t('profile.role')}
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

        <Button variant="secondary" fullWidth onPress={signOut} style={styles.logout}>
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
