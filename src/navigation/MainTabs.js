import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import CustomTabBar from './CustomTabBar';
import ScheduleStack from './ScheduleStack';
import HistoryStack from './HistoryStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="ScheduleTab" component={ScheduleStack} options={{ title: t('tabs.schedule') }} />
      <Tab.Screen name="HistoryTab" component={HistoryStack} options={{ title: t('tabs.history') }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: t('tabs.profile') }} />
    </Tab.Navigator>
  );
}
