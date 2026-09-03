'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import {
  CheckCircle2,
  Building2,
  ArrowRight,
  PowerOff,
  Plus,
} from 'lucide-react';
import { SystemModule } from './types';

interface ModuleCardProps {
  module: SystemModule;
  index: number;
  isEnabled: boolean;
  isLocked: boolean;
  activeOrg: string;
  onAction: (mod: SystemModule) => void;
  onDisableDirectly: (mod: SystemModule, e: React.MouseEvent) => void;
  cardVariants: Variants;
}

export function ModuleCard({
  module: mod,
  index: idx,
  isEnabled,
  isLocked,
  activeOrg,
  onAction,
  onDisableDirectly,
  cardVariants,
}: ModuleCardProps) {
  const Icon = mod.icon;

  return (
    <motion.div
      key={mod.id}
      custom={idx}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      whileHover={{ y: isLocked ? 0 : -4 }}
      className={`group rounded-2xl bg-white border p-5 flex flex-col justify-between transition-all relative overflow-hidden ${
        isLocked
          ? 'border-slate-200 opacity-75'
          : isEnabled
          ? 'border-orange-200 shadow-sm hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/10'
          : 'border-slate-200/90 hover:border-orange-400/80 hover:shadow-lg hover:shadow-orange-500/5'
      }`}
    >
      <div>
        {/* Top Header: Icon & Status Badge */}
        <div className="flex items-center justify-between mb-3.5">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${mod.gradient} p-0.5 shadow-sm`}
          >
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Icon className="w-5 h-5 text-slate-900 group-hover:scale-105 transition-transform" />
            </div>
          </div>

          {/* Enabled / Disabled Status Pill */}
          {isEnabled ? (
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Active</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
              {mod.badge || 'Disabled'}
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="text-base font-extrabold transition-colors tracking-tight text-slate-900 group-hover:text-orange-600">
          {mod.title}
        </h4>

        {/* Concise Description */}
        <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium line-clamp-2">
          {mod.description}
        </p>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
        {isLocked ? (
          <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
            <Building2 className="w-3 h-3 text-amber-600" />
            <span>Org Required</span>
          </span>
        ) : isEnabled ? (
          <button
            type="button"
            onClick={(e) => onDisableDirectly(mod, e)}
            title={`Disable ${mod.title} for ${activeOrg}`}
            className="text-[10px] font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <PowerOff className="w-2.5 h-2.5" />
            <span>Disable</span>
          </button>
        ) : (
          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
            <span>Not Active</span>
          </span>
        )}

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onAction(mod)}
          className={`px-4 py-2 rounded-xl font-extrabold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ${
            isLocked
              ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              : isEnabled
              ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/20'
              : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'
          }`}
        >
          <span>
            {isLocked ? 'Enable' : isEnabled ? 'Launch' : 'Enable'}
          </span>
          {isEnabled ? (
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          ) : (
            <Plus className="w-3.5 h-3.5" />
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
