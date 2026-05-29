import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../api/api-client';
import { getToken } from '../api/storage';
import * as ordersApi from '../api/orders';
import { useAuth } from './AuthContext';
import { processOfflineQueue } from '../utils/offlineQueue';

const PROVIDER_EVENTS = new Set(['ORDER_ASSIGNED', 'PROVIDER_RECEIPT', 'INBOX_MESSAGE']);

const RealtimeContext = createContext(null);

async function syncQueueItem(item) {
  if (item.type === 'check_in') {
    await ordersApi.checkIn(item.orderId, item.payload);
  } else if (item.type === 'check_out') {
    await ordersApi.checkOut(item.orderId, item.payload);
  } else if (item.type === 'add_extra') {
    await ordersApi.addExtra(item.orderId, item.payload.extraId);
  }
}

export function RealtimeProvider({ children }) {
  const { t } = useTranslation();
  const { isAuthenticated, isProvider, signOut } = useAuth();
  const [connected, setConnected] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const listenersRef = useRef(new Map());

  const bumpRefresh = useCallback((scope) => {
    setRefreshToken((prev) => prev + 1);
    listenersRef.current.get(scope)?.forEach((callback) => callback());
  }, []);

  const subscribe = useCallback((scope, callback) => {
    if (!listenersRef.current.has(scope)) {
      listenersRef.current.set(scope, new Set());
    }
    listenersRef.current.get(scope).add(callback);
    return () => listenersRef.current.get(scope)?.delete(callback);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return undefined;

    let socket;

    async function connect() {
      const token = await getToken();
      if (!token) return;

      if (isProvider) {
        await processOfflineQueue(syncQueueItem);
      }

      socket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
      });

      socket.on('connect', () => setConnected(true));
      socket.on('disconnect', () => setConnected(false));

      socket.on('notification', (payload) => {
        const type = payload?.type;

        bumpRefresh('notifications');

        if (isProvider && PROVIDER_EVENTS.has(type)) {
          Alert.alert(
            payload.title || t('realtime.newOrderTitle'),
            payload.message || t('realtime.newOrderMessage')
          );
          bumpRefresh('schedule');
        }

        if (type === 'ORDER_COMPLETED') {
          bumpRefresh('properties');
          bumpRefresh('history');
        }

        if (type === 'INVENTORY_CRITICAL' || type === 'INVENTORY_LOW') {
          bumpRefresh('inventory');
          if (!isProvider) {
            Alert.alert(
              payload.title || t('realtime.inventoryCriticalTitle'),
              payload.message || t('realtime.inventoryCriticalMessage')
            );
          }
        }

        if (type === 'PROVIDER_RECEIPT' && isProvider) {
          bumpRefresh('history');
        }

        if (type === 'CLIENT_INVOICE' && !isProvider) {
          bumpRefresh('orders');
        }

        if (type === 'INBOX_MESSAGE') {
          bumpRefresh('messages');
        }

        if (type === 'CLEANING_REMINDER' && !isProvider) {
          bumpRefresh('orders');
          Alert.alert(
            payload.title || t('realtime.cleaningReminderTitle'),
            payload.message || t('realtime.cleaningReminderMessage')
          );
        }

        if (type === 'FIELD_REPORT') {
          bumpRefresh('fieldReports');
        }
      });

      socket.on('force_logout', (payload) => {
        Alert.alert(
          payload?.title || t('realtime.sessionEnded'),
          payload?.message || t('realtime.sessionEndedMessage'),
          [{ text: t('common.continue'), onPress: () => signOut() }]
        );
        signOut();
      });
    }

    connect();

    return () => {
      socket?.disconnect();
      setConnected(false);
    };
  }, [isAuthenticated, isProvider, signOut, t, bumpRefresh]);

  const value = useMemo(
    () => ({ connected, refreshToken, bumpRefresh, subscribe }),
    [connected, refreshToken, bumpRefresh, subscribe]
  );

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

export function useRealtime() {
  const ctx = useContext(RealtimeContext);
  if (!ctx) {
    return { connected: false, refreshToken: 0, bumpRefresh: () => {}, subscribe: () => () => {} };
  }
  return ctx;
}
