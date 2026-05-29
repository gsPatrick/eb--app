import React from 'react';
import { useAuth } from '../context/AuthContext';
import MainTabs from './MainTabs';
import ClientMainTabs from './ClientMainTabs';

export default function MainRouter() {
  const { isClient } = useAuth();
  return isClient ? <ClientMainTabs /> : <MainTabs />;
}
