import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CalendarDays, History, User } from 'lucide-react-native';
import EBText from '../components/atoms/Text';
import { colors, radius, shadows, spacing } from '../theme/variables';

const TAB_ICONS = {
  ScheduleTab: CalendarDays,
  HistoryTab: History,
  ProfileTab: User,
};

const TAB_LABEL_KEYS = {
  ScheduleTab: 'tabs.schedule',
  HistoryTab: 'tabs.history',
  ProfileTab: 'tabs.profile',
};

export default function CustomTabBar({ state, descriptors, navigation }) {
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const labelKey = TAB_LABEL_KEYS[route.name];
          const label = labelKey ? t(labelKey) : options.title ?? route.name;
          const isFocused = state.index === index;
          const Icon = TAB_ICONS[route.name] || CalendarDays;

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
                  fontSize: 11,
                  marginTop: 4,
                }}
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
