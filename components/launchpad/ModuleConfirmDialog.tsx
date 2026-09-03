'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  PowerOff,
  Sparkles,
  X,
  Building2,
} from 'lucide-react';
import { SystemModule } from './types';

export interface ConfirmDialogState {
  isOpen: boolean;
  type: 'enable' | 'disable' | 'enable-all' | 'disable-all';
  module?: SystemModule | null;
  orgName: string;
  onConfirm: () => void;
}

interface ModuleConfirmDialogProps {
  dialogState: ConfirmDialogState;
  onClose: () => void;
}

export function ModuleConfirmDialog({
  dialogState,
  onClose,
}: ModuleConfirmDialogProps) {
  const { isOpen, type, module: mod, orgName, onConfirm } = dialogState;

  if (!isOpen) return null;

  const isDisable = type === 'disable' || type === 'disable-all';
  const isAll = type === 'enable-all' || type === 'disable-all';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-800 space-y-5 relative overflow-hidden"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Dialog Header Icon & Title */}
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 shadow-md ${
                isDisable
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              }`}
            >
              {isDisable ? (
                <PowerOff className="w-6 h-6" />
              ) : (
                <CheckCircle2 className="w-6 h-6" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                {isAll
                  ? isDisable
                    ? 'Disable All Modules?'
                    : 'Enable All Modules?'
                  : isDisable
                  ? `Disable "${mod?.title}"?`
                  : `Enable "${mod?.title}"?`}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-medium">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Target:</span>
                <span className="font-bold text-orange-600 truncate max-w-[200px]">
                  {orgName}
                </span>
              </div>
            </div>
          </div>

          {/* Description & Impact Notice */}
          <div
            className={`p-4 rounded-2xl text-xs space-y-2 border ${
              isDisable
                ? 'bg-rose-50/60 border-rose-200/80 text-rose-900'
                : 'bg-emerald-50/60 border-emerald-200/80 text-emerald-900'
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              {isDisable ? (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span>
                {isDisable
                  ? 'Access Restriction Notice'
                  : 'Instant Activation Notice'}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              {isAll
                ? isDisable
                  ? `Disabling all modules will lock POS, Inventory, KDS, and Finance applications for workspace "${orgName}". Staff members will not be able to open these applications.`
                  : `Enabling all modules will immediately unlock the entire CodeBridges Enterprise Suite for workspace "${orgName}".`
                : isDisable
                ? `Disabling "${mod?.title}" will restrict access to this module for users in "${orgName}". Existing data remains safe in the database.`
                : `Enabling "${mod?.title}" will immediately make this application active and launchable for staff members assigned to "${orgName}".`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`w-full sm:flex-1 py-2.5 rounded-xl font-extrabold text-xs text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isDisable
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
              }`}
            >
              {isDisable ? (
                <>
                  <PowerOff className="w-3.5 h-3.5" />
                  <span>Yes, Disable</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Yes, Enable</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
