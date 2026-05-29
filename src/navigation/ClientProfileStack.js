import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ClientContractsScreen from '../screens/client/ClientContractsScreen';
import ClientBillingScreen from '../screens/client/ClientBillingScreen';
import ClientMessagesScreen from '../screens/client/ClientMessagesScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Stack = createNativeStackNavigator();

export default function ClientProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Contracts" component={ClientContractsScreen} />
      <Stack.Screen name="Billing" component={ClientBillingScreen} />
      <Stack.Screen name="Messages" component={ClientMessagesScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}
