import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LanguageOnboardingScreen from '../screens/LanguageOnboardingScreen';
import AuthIntroScreen from '../screens/AuthIntroScreen';
import AuthChoiceScreen from '../screens/AuthChoiceScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ForgotPasswordOtpScreen from '../screens/ForgotPasswordOtpScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import PermissionsScreen from '../screens/PermissionsScreen';
import MainTabs from './MainTabs';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="LanguageOnboarding" component={LanguageOnboardingScreen} />
      <Stack.Screen name="AuthIntro" component={AuthIntroScreen} />
      <Stack.Screen name="AuthChoice" component={AuthChoiceScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ForgotPasswordOtp" component={ForgotPasswordOtpScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="Permissions" component={PermissionsScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  );
}
