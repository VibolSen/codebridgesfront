'use client';

import React from 'react';
import { ToastProvider } from './ToastContext';
import { ConfirmProvider } from './ConfirmContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ConfirmProvider>
        {children}
      </ConfirmProvider>
    </ToastProvider>
  );
}
