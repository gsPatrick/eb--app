import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOCALE_STORAGE_KEY } from '../i18n/config';

const QUEUE_KEY = 'eb_offline_queue';

export async function getOfflineQueue() {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function enqueueOfflineAction(action) {
  const queue = await getOfflineQueue();
  queue.push({ ...action, id: `${Date.now()}-${Math.random()}`, createdAt: new Date().toISOString() });
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  return queue.length;
}

export async function removeOfflineAction(actionId) {
  const queue = (await getOfflineQueue()).filter((item) => item.id !== actionId);
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export async function processOfflineQueue(processor) {
  const queue = await getOfflineQueue();
  const remaining = [];

  for (const item of queue) {
    try {
      await processor(item);
      await removeOfflineAction(item.id);
    } catch {
      remaining.push(item);
    }
  }

  if (remaining.length !== queue.length) {
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
  }

  return remaining.length;
}

export async function getLocale() {
  return AsyncStorage.getItem(LOCALE_STORAGE_KEY);
}

export async function saveLocale(locale) {
  await AsyncStorage.setItem(LOCALE_STORAGE_KEY, locale);
}
