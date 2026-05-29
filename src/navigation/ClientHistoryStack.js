import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClientHistoryScreen from '../screens/client/ClientHistoryScreen';
import HistoryDetailScreen from '../screens/HistoryDetailScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Stack = createNativeStackNavigator();

export default function ClientHistoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="ClientHistoryList" component={ClientHistoryScreen} />
      <Stack.Screen name="HistoryDetail" component={HistoryDetailScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}
