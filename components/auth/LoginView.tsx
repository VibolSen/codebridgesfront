'use client';

import React, { Suspense } from 'react';
import { LoginForm } from './LoginForm';

export function LoginView() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 flex items-center justify-center font-sans text-xs text-slate-500 font-bold">
          Loading sign in...
        </div>
      }
    >
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F0F4F8] text-slate-900 p-4 font-sans selection:bg-[#5B4DFB] selection:text-white">
        <LoginForm />
      </div>
    </Suspense>
  );
}
