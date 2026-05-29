import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Building2, History, Package, User, CalendarDays } from 'lucide-react-native';
import EBText from '../components/atoms/Text';
import { colors, radius, shadows, spacing } from '../theme/variables';

const PROVIDER_TABS = {
  ScheduleTab: { icon: CalendarDays, labelKey: 'tabs.schedule' },
  HistoryTab: { icon: History, labelKey: 'tabs.history' },
  ProfileTab: { icon: User, labelKey: 'tabs.profile' },
};

const CLIENT_TABS = {
  PropertiesTab: { icon: Building2, labelKey: 'clientTabs.properties' },
  HistoryTab: { icon: History, labelKey: 'clientTabs.history' },
  InventoryTab: { icon: Package, labelKey: 'clientTabs.inventory' },
  ProfileTab: { icon: User, labelKey: 'clientTabs.profile' },
};

export default function CustomTabBar({ state, descriptors, navigation, variant = 'provider' }) {
  const { t } = useTranslation();
  const tabConfig = variant === 'client' ? CLIENT_TABS : PROVIDER_TABS;

  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const config = tabConfig[route.name];
          const labelKey = config?.labelKey;
          const label = labelKey ? t(labelKey) : options.title ?? route.name;
          const isFocused = state.index === index;
          const Icon = config?.icon || CalendarDays;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable key={route.key} style={styles.tab} onPress={onPress}>
              <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
                <Icon size={22} color={isFocused ? colors.primary : colors.textMuted} strokeWidth={isFocused ? 2.2 : 1.8} />
              </View>
              <EBText
                variant="caption"
                style={{
                  color: isFocused ? colors.primary : colors.textMuted,
                  fontWeight: isFocused ? '600' : '400',
                  fontSize: 10,
                  marginTop: 4,
                  textAlign: 'center',
                }}
                numberOfLines={1}
              >
                {label}
              </EBText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.xl,
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xxl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: spacing.xs },
  iconWrap: {
    width: 44,
    height: 32,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: colors.primarySoft },
});
