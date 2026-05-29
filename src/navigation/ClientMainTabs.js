import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import CustomTabBar from './CustomTabBar';
import ClientPropertiesScreen from '../screens/client/ClientPropertiesScreen';
import ClientOrdersScreen from '../screens/client/ClientOrdersScreen';
import ClientHistoryStack from './ClientHistoryStack';
import ClientInventoryScreen from '../screens/client/ClientInventoryScreen';
import ClientProfileStack from './ClientProfileStack';

const Tab = createBottomTabNavigator();

export default function ClientMainTabs() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} variant="client" />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="PropertiesTab"
        component={ClientPropertiesScreen}
        options={{ title: t('clientTabs.properties') }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={ClientOrdersScreen}
        options={{ title: t('clientTabs.orders') }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={ClientHistoryStack}
        options={{ title: t('clientTabs.history') }}
      />
      <Tab.Screen
        name="InventoryTab"
        component={ClientInventoryScreen}
        options={{ title: t('clientTabs.inventory') }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ClientProfileStack}
        options={{ title: t('clientTabs.profile') }}
      />
    </Tab.Navigator>
  );
}
