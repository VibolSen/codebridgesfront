'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Grid, X, Check } from 'lucide-react';

interface PermissionsMatrixModalProps {
  isOpen: boolean;
  permissionsMatrix: any | null;
  onClose: () => void;
}

export function PermissionsMatrixModal({
  isOpen,
  permissionsMatrix,
  onClose,
}: PermissionsMatrixModalProps) {
  if (!isOpen || !permissionsMatrix) return null;

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-amber-500/15 text-amber-700 border-amber-300';
      case 'admin':
      case 'administrator':
        return 'bg-orange-500/15 text-orange-700 border-orange-300';
      case 'outlet_manager':
        return 'bg-indigo-500/15 text-indigo-700 border-indigo-300';
      case 'supervisor':
        return 'bg-purple-500/15 text-purple-700 border-purple-300';
      case 'cashier':
        return 'bg-emerald-500/15 text-emerald-700 border-emerald-300';
      case 'inventory_clerk':
        return 'bg-cyan-500/15 text-cyan-700 border-cyan-300';
      case 'accountant':
        return 'bg-blue-500/15 text-blue-700 border-blue-300';
      case 'user':
        return 'bg-teal-500/15 text-teal-700 border-teal-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl space-y-5 border border-slate-100 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <Grid className="w-5 h-5 text-orange-500" />
              Role Capabilities & Permissions Matrix
            </h3>
            <p className="text-xs text-slate-400">Predefined system roles and capability boundaries</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {Object.entries(permissionsMatrix).map(([roleKey, roleInfo]: [string, any]) => (
            <div key={roleKey} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getRoleBadgeStyle(
                    roleKey
                  )}`}
                >
                  {roleInfo.name || roleKey}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {roleInfo.capabilities ? roleInfo.capabilities.length : 0} Capabilities
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {roleInfo.capabilities &&
                  roleInfo.capabilities.map((cap: string) => (
                    <span
                      key={cap}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-700"
                    >
                      <Check className="w-3 h-3 text-emerald-500" /> {cap}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
