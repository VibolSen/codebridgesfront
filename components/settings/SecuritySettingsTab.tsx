'use client';

import React from 'react';

interface SecuritySettingsTabProps {
  enforce2FA: boolean;
  setEnforce2FA: (val: boolean) => void;
  allowCashierPinSwitch: boolean;
  setAllowCashierPinSwitch: (val: boolean) => void;
  sessionTimeout: string;
  setSessionTimeout: (val: string) => void;
}

export function SecuritySettingsTab({
  enforce2FA,
  setEnforce2FA,
  allowCashierPinSwitch,
  setAllowCashierPinSwitch,
  sessionTimeout,
  setSessionTimeout,
}: SecuritySettingsTabProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
        Security &amp; Register Terminal Policies
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div>
            <p className="text-xs font-bold text-slate-900">
              Mandatory 2FA for Platform Admins
            </p>
            <p className="text-[11px] text-slate-400">
              Require authenticator app (TOTP) for all Super Admin Console logins.
            </p>
          </div>
          <input
            type="checkbox"
            checked={enforce2FA}
            onChange={(e) => setEnforce2FA(e.target.checked)}
            className="w-4 h-4 rounded text-brand focus:ring-brand border-slate-300 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div>
            <p className="text-xs font-bold text-slate-900">
              Fast Cashier 4-Digit PIN Quick-Switch
            </p>
            <p className="text-[11px] text-slate-400">
              Allow frontline cashiers to switch active accounts on the POS register using 4-digit PINs.
            </p>
          </div>
          <input
            type="checkbox"
            checked={allowCashierPinSwitch}
            onChange={(e) => setAllowCashierPinSwitch(e.target.checked)}
            className="w-4 h-4 rounded text-brand focus:ring-brand border-slate-300 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Super Admin Idle Session Timeout (Minutes)
          </label>
          <input
            type="number"
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(e.target.value)}
            className="w-full max-w-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
          />
        </div>
      </div>
    </div>
  );
}
