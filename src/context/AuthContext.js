import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { setUnauthorizedHandler } from '../api/api-client';
import * as authApi from '../api/auth';
import {
  arePermissionsGranted,
  clearAppStorage,
  clearAuthSession,
  getAuthIntentRole,
  getToken,
  getUser,
  isOnboardingDone,
  setAuthIntentRole,
  setOnboardingDone,
  setPermissionsGranted,
} from '../api/storage';

const MOBILE_ROLES = new Set(['provider', 'client']);

function assertMobileRole(user) {
  if (!MOBILE_ROLES.has(user?.role)) {
    const err = new Error('UNSUPPORTED_ROLE');
    err.code = 'UNSUPPORTED_ROLE';
    throw err;
  }
}

const AuthContext = createContext(null);
const PanelLoadingContext = createContext({ setPanelLoading: () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [onboardingDone, setOnboardingDoneState] = useState(false);
  const [permissionsGranted, setPermissionsGrantedState] = useState(false);
  const [authIntentRole, setAuthIntentRoleState] = useState(null);
  const [panelLoading, setPanelLoading] = useState(false);
  const [navResetKey, setNavResetKey] = useState(0);

  const signOut = useCallback(async () => {
    await clearAppStorage();
    setUser(null);
    setNavResetKey((key) => key + 1);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      signOut();
    });
  }, [signOut]);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const [token, storedUser, onboarding, permissions, intentRole] = await Promise.all([
          getToken(),
          getUser(),
          isOnboardingDone(),
          arePermissionsGranted(),
          getAuthIntentRole(),
        ]);

        if (cancelled) return;

        setOnboardingDoneState(onboarding);
        setPermissionsGrantedState(permissions);
        setAuthIntentRoleState(intentRole);

        if (token && storedUser) {
          if (!MOBILE_ROLES.has(storedUser.role)) {
            await clearAuthSession();
            return;
          }

          setUser(storedUser);
          try {
            const fresh = await authApi.me();
            if (cancelled) return;

            const activeToken = await getToken();
            if (!activeToken) return;

            if (!MOBILE_ROLES.has(fresh.role)) {
              await clearAuthSession();
              setUser(null);
              return;
            }

            setUser(fresh);
            await setAuthIntentRole(fresh.role);
            setAuthIntentRoleState(fresh.role);
          } catch {
            const activeToken = await getToken();
            if (!cancelled && !activeToken) {
              setUser(null);
            }
          }
        }
      } finally {
        if (!cancelled) {
          setBooting(false);
        }
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const chooseAuthRole = useCallback(async (role) => {
    await setAuthIntentRole(role);
    setAuthIntentRoleState(role);

    if (role === 'client') {
      await setPermissionsGranted();
      setPermissionsGrantedState(true);
    }
  }, []);

  const signIn = useCallback(async (credentials) => {
    const { user: loggedUser } = await authApi.login(credentials);
    assertMobileRole(loggedUser);
    await setAuthIntentRole(loggedUser.role);
    setAuthIntentRoleState(loggedUser.role);
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
    const role = payload.role || authIntentRole || 'provider';
    await authApi.register({
      ...payload,
      role,
    });
  }, [authIntentRole]);

  const value = useMemo(
    () => ({
      user,
      booting,
      onboardingDone,
      permissionsGranted,
      authIntentRole,
      panelLoading,
      navResetKey,
      isAuthenticated: Boolean(user),
      isProvider: user?.role === 'provider',
      isClient: user?.role === 'client',
      signIn,
      signUp,
      signOut,
      chooseAuthRole,
      completeOnboarding,
      completePermissions,
    }),
    [
      user,
      booting,
      onboardingDone,
      permissionsGranted,
      authIntentRole,
      panelLoading,
      navResetKey,
      signIn,
      signUp,
      signOut,
      chooseAuthRole,
      completeOnboarding,
      completePermissions,
    ]
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
