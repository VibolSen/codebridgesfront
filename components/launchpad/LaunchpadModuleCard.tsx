'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Power, Plus, RefreshCw } from 'lucide-react';
import { CatalogModule } from './types';

interface LaunchpadModuleCardProps {
  module: CatalogModule;
  isEnabled: boolean;
  isProcessing: boolean;
  userRole?: string;
  onToggleModule: (moduleId: string, enable: boolean) => void;
  variant?: 'active' | 'catalog';
}

export function LaunchpadModuleCard({
  module,
  isEnabled,
  isProcessing,
  userRole,
  onToggleModule,
  variant = 'catalog',
}: LaunchpadModuleCardProps) {
  const IconComponent = module.icon;
  const launchHref =
    module.id === 'pos-management' && userRole === 'cashier' ? '/pos/terminal' : module.href;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-3xl border p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-md transition-shadow flex flex-col justify-between h-[195px] ${
        isEnabled ? 'border-emerald-200/90' : 'border-slate-200/80'
      }`}
    >
      <div>
        {/* Top: Monogram Pill, Title & Pulsing Status */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${module.bgPill}`}>
              <IconComponent className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="font-extrabold text-xs text-slate-900 truncate">{module.name}</h4>
              <p className="text-[10px] text-slate-400 font-medium">{module.category}</p>
            </div>
          </div>
          {isEnabled && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100 shrink-0 ml-2" />
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed mt-2">
          {module.description}
        </p>
      </div>

      {/* Footer: Live State & Dynamic Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        {isEnabled ? (
          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{variant === 'active' ? 'Active Running' : 'Active'}</span>
          </span>
        ) : (
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            Not Activated
          </span>
        )}

        <div className="flex items-center gap-1.5">
          {isEnabled ? (
            <>
              <button
                type="button"
                onClick={() => onToggleModule(module.id, false)}
                disabled={isProcessing}
                title="Deactivate Module"
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Power className="w-3.5 h-3.5" />
                )}
              </button>
              <Link
                href={launchHref}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#5B4DFB] hover:bg-[#4E3FE3] text-white font-extrabold text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <span>Launch</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onToggleModule(module.id, true)}
              disabled={isProcessing}
              className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-[#5B4DFB] text-[#5B4DFB] hover:text-white border border-purple-200 font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <Plus className="w-3 h-3" />
              )}
              <span>Enable Service</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
