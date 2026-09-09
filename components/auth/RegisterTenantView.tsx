'use client';

import React, { Suspense } from 'react';
import { RegisterTenantForm } from './RegisterTenantForm';

export function RegisterTenantView() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans text-xs text-slate-500 font-bold">
          Loading workspace setup...
        </div>
      }
    >
      <RegisterTenantForm />
    </Suspense>
  );
}
