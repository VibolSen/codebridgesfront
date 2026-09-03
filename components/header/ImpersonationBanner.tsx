'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, LogOut, Lock, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ImpersonationBanner() {
  const router = useRouter();
  const [impersonation, setImpersonation] = useState<{
    orgId: string;
    orgName: string;
    reason: string;
  } | null>(null);

  useEffect(() => {
    const checkImpersonation = () => {
      try {
        const raw = localStorage.getItem('cb_impersonation');
        if (raw) {
          setImpersonation(JSON.parse(raw));
        } else {
          setImpersonation(null);
        }
      } catch {
        setImpersonation(null);
      }
    };

    checkImpersonation();
    window.addEventListener('storage', checkImpersonation);
    window.addEventListener('cb_impersonation_changed', checkImpersonation);

    return () => {
      window.removeEventListener('storage', checkImpersonation);
      window.removeEventListener('cb_impersonation_changed', checkImpersonation);
    };
  }, []);

  const handleExitImpersonation = () => {
    localStorage.removeItem('cb_impersonation');
    window.dispatchEvent(new Event('cb_impersonation_changed'));
    window.dispatchEvent(new Event('cb_org_changed'));
    setImpersonation(null);
    router.push('/super-admin/platform/tenants');
  };

  if (!impersonation) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-2 text-xs font-bold shadow-md z-50 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-200" />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span>You are currently impersonating</span>
          <span className="px-2 py-0.5 rounded bg-black/20 font-black underline decoration-amber-300">
            {impersonation.orgName}
          </span>
          <span className="text-amber-100 text-[11px] hidden sm:inline">
            • Justification: {impersonation.reason}
          </span>
        </div>
      </div>

      <button
        onClick={handleExitImpersonation}
        className="px-3 py-1 rounded-lg bg-white text-orange-800 hover:bg-amber-50 font-extrabold text-[11px] shadow-xs flex items-center gap-1 transition-all shrink-0"
      >
        <LogOut className="w-3 h-3" />
        <span>Exit Impersonation</span>
      </button>
    </div>
  );
}
