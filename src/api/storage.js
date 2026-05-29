import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearOfflineQueue } from '../utils/offlineQueue';

export const STORAGE_KEYS = {
  TOKEN: 'eb_token',
  USER: 'eb_user',
  ONBOARDING: 'eb_onboarding_done',
  PERMISSIONS: 'eb_permissions_granted',
  LOCALE: 'eb_locale',
  LOCALE_ONBOARDING: 'eb_locale_onboarding_done',
  AUTH_INTENT_ROLE: 'eb_auth_intent_role',
};

export async function getToken() {
  return AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
}

export async function getUser() {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER);
  return raw ? JSON.parse(raw) : null;
}

export async function saveAuthSession(token, user) {
  await AsyncStorage.multiSet([
    [STORAGE_KEYS.TOKEN, token],
    [STORAGE_KEYS.USER, JSON.stringify(user)],
  ]);
}

export async function clearAuthSession() {
  await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
}

/** Remove sessão, fila offline e outros dados voláteis (mantém idioma e onboarding). */
export async function clearAppStorage() {
  await Promise.all([clearAuthSession(), clearOfflineQueue()]);
}

export async function isOnboardingDone() {
  return (await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING)) === 'true';
}

export async function setOnboardingDone() {
  await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true');
}

export async function arePermissionsGranted() {
  return (await AsyncStorage.getItem(STORAGE_KEYS.PERMISSIONS)) === 'true';
}

export async function setPermissionsGranted() {
  await AsyncStorage.setItem(STORAGE_KEYS.PERMISSIONS, 'true');
}

export async function isLocaleOnboardingDone() {
  return (await AsyncStorage.getItem(STORAGE_KEYS.LOCALE_ONBOARDING)) === 'true';
}

export async function setLocaleOnboardingDone() {
  await AsyncStorage.setItem(STORAGE_KEYS.LOCALE_ONBOARDING, 'true');
}

export async function getAuthIntentRole() {
  return AsyncStorage.getItem(STORAGE_KEYS.AUTH_INTENT_ROLE);
}

export async function setAuthIntentRole(role) {
  if (role) {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_INTENT_ROLE, role);
  } else {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_INTENT_ROLE);
  }
}
