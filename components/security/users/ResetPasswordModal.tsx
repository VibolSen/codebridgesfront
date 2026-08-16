'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { KeyRound, X } from 'lucide-react';

interface ResetPasswordModalProps {
  user: any | null;
  newPasswordInput: string;
  onPasswordChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
}

export function ResetPasswordModal({
  user,
  newPasswordInput,
  onPasswordChange,
  onClose,
  onSubmit,
  saving,
}: ResetPasswordModalProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-slate-100"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-indigo-500" /> Reset Staff Password
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Enter a new password for <strong className="text-slate-900">{user.name}</strong> ({user.email}).
        </p>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">New Password *</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPasswordInput}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
            >
              {saving ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
