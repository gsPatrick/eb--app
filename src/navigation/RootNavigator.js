import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/I18nProvider';
import { RealtimeProvider } from '../context/RealtimeContext';
import { navigationRef } from './navigationRef';
import { getAuthFlowRoute } from './flowRoutes';
import SplashScreenView from '../screens/SplashScreen';
import MainRouter from './MainRouter';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ForgotPasswordOtpScreen from '../screens/ForgotPasswordOtpScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import PermissionsScreen from '../screens/PermissionsScreen';
import AuthIntroScreen from '../screens/AuthIntroScreen';
import AuthChoiceScreen from '../screens/AuthChoiceScreen';
import LanguageOnboardingScreen from '../screens/LanguageOnboardingScreen';
import ForbiddenScreen from '../screens/ForbiddenScreen';
import { colors } from '../theme/variables';

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

const authScreens = (
  <>
    <AuthStack.Screen name="LanguageOnboarding" component={LanguageOnboardingScreen} />
    <AuthStack.Screen name="AuthIntro" component={AuthIntroScreen} />
    <AuthStack.Screen name="AuthChoice" component={AuthChoiceScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <AuthStack.Screen name="ForgotPasswordOtp" component={ForgotPasswordOtpScreen} />
    <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    <AuthStack.Screen name="Permissions" component={PermissionsScreen} />
    <AuthStack.Screen name="Main" component={MainRouter} />
  </>
);

function AuthenticatedNavigator() {
  const { user } = useAuth();

  return (
    <RealtimeProvider>
      <AppStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <AppStack.Screen name="Main" component={MainRouter} key={user?.role || 'main'} />
        <AppStack.Screen name="Forbidden" component={ForbiddenScreen} />
      </AppStack.Navigator>
    </RealtimeProvider>
  );
}

function AppNavigator() {
  const { booting, isAuthenticated, onboardingDone, permissionsGranted, authIntentRole } = useAuth();
  const { localeOnboardingDone, ready: i18nReady } = useLocale();

  if (booting || !i18nReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const flowRoute = getAuthFlowRoute({
    localeOnboardingDone,
    onboardingDone,
    isAuthenticated,
    permissionsGranted,
    authIntentRole,
  });

  if (flowRoute === null) {
    return <AuthenticatedNavigator key="app-authenticated" />;
  }

  return (
    <AuthStack.Navigator
      key={`auth-flow-${flowRoute}`}
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      initialRouteName={flowRoute}
    >
      {authScreens}
    </AuthStack.Navigator>
  );
}

export default function RootNavigator() {
  const [showSplash, setShowSplash] = useState(true);
  const { navResetKey } = useAuth();

  if (showSplash) {
    return <SplashScreenView onFinish={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer ref={navigationRef} key={`root-nav-${navResetKey}`}>
      <AppNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
});
