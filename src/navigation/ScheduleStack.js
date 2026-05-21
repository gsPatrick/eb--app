import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScheduleScreen from '../screens/ScheduleScreen';
import ExecutionScreen from '../screens/Execution';

const Stack = createNativeStackNavigator();

export default function ScheduleStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="ScheduleList" component={ScheduleScreen} />
      <Stack.Screen name="Execution" component={ExecutionScreen} />
    </Stack.Navigator>
  );
}
