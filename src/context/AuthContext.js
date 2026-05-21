import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { setUnauthorizedHandler } from '../api/api-client';
import * as authApi from '../api/auth';
import {
  arePermissionsGranted,
  clearAuthSession,
  getToken,
  getUser,
  isOnboardingDone,
  setOnboardingDone,
  setPermissionsGranted,
} from '../api/storage';

const AuthContext = createContext(null);
const PanelLoadingContext = createContext({ setPanelLoading: () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [onboardingDone, setOnboardingDoneState] = useState(false);
  const [permissionsGranted, setPermissionsGrantedState] = useState(false);
  const [panelLoading, setPanelLoading] = useState(false);

  const signOut = useCallback(async () => {
    await clearAuthSession();
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => signOut());
  }, [signOut]);

  useEffect(() => {
    async function bootstrap() {
      try {
        const [token, storedUser, onboarding, permissions] = await Promise.all([
          getToken(),
          getUser(),
          isOnboardingDone(),
          arePermissionsGranted(),
        ]);
        setOnboardingDoneState(onboarding);
        setPermissionsGrantedState(permissions);
        if (token && storedUser) {
          setUser(storedUser);
          try {
            const fresh = await authApi.me();
            setUser(fresh);
          } catch {
            /* keep stored user */
          }
        }
      } finally {
        setBooting(false);
      }
    }
    bootstrap();
  }, []);

  const signIn = useCallback(async (credentials) => {
    const { user: loggedUser } = await authApi.login(credentials);
    if (loggedUser.role !== 'provider') {
      await clearAuthSession();
      const err = new Error('PROVIDER_ONLY');
      err.code = 'PROVIDER_ONLY';
      throw err;
    }
    setUser(loggedUser);
    return loggedUser;
  }, []);

  const completeOnboarding = useCallback(async () => {
    await setOnboardingDone();
    setOnboardingDoneState(true);
  }, []);

  const completePermissions = useCallback(async () => {
    await setPermissionsGranted();
    setPermissionsGrantedState(true);
  }, []);

  const signUp = useCallback(async (payload) => {
    await authApi.register({
      ...payload,
      role: 'provider',
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      booting,
      onboardingDone,
      permissionsGranted,
      panelLoading,
      isAuthenticated: Boolean(user),
      signIn,
      signUp,
      signOut,
      completeOnboarding,
      completePermissions,
    }),
    [user, booting, onboardingDone, permissionsGranted, panelLoading, signIn, signUp, signOut, completeOnboarding, completePermissions]
  );

  return (
    <AuthContext.Provider value={value}>
      <PanelLoadingContext.Provider value={{ panelLoading, setPanelLoading }}>
        {children}
      </PanelLoadingContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function usePanelLoading() {
  return useContext(PanelLoadingContext);
}
