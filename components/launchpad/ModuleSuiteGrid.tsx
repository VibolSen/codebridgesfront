'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import {
  Lock,
  Sliders,
  CheckCircle2,
  Sparkles,
  PackageCheck,
  PlusCircle,
} from 'lucide-react';
import { SystemModule, MODULES_SUITE } from './types';
import { ModuleCard } from './ModuleCard';

interface ModuleSuiteGridProps {
  user: any;
  isAuthenticated: boolean;
  hasValidOrg: boolean;
  activeOrg: string;
  enabledModules: string[];
  onCardAction: (mod: SystemModule) => void;
  onDisableDirectly: (mod: SystemModule, e: React.MouseEvent) => void;
  onOpenManageModal: (mod: SystemModule | null) => void;
  cardVariants: Variants;
}

export function ModuleSuiteGrid({
  user,
  isAuthenticated,
  hasValidOrg,
  activeOrg,
  enabledModules,
  onCardAction,
  onDisableDirectly,
  onOpenManageModal,
  cardVariants,
}: ModuleSuiteGridProps) {
  // Separate modules into Enabled and Not Yet Enabled lists
  const enabledList = MODULES_SUITE.filter((mod) => enabledModules.includes(mod.id));
  const disabledList = MODULES_SUITE.filter((mod) => !enabledModules.includes(mod.id));

  return (
    <div className="space-y-10">
      {/* Top Action & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <span>Modular Application Suite</span>
            <span className="text-xs bg-slate-100 text-slate-600 font-extrabold px-2.5 py-0.5 rounded-full border border-slate-200">
              {MODULES_SUITE.length} Total
            </span>
          </h3>
          {activeOrg ? (
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Current Organization: <span className="font-extrabold text-orange-600">{activeOrg}</span> •{' '}
              <span className="font-bold text-emerald-600">{enabledList.length} Active</span>,{' '}
              <span className="font-bold text-slate-500">{disabledList.length} Available to Enable</span>
            </p>
          ) : (
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Select or create an organization to manage active applications.
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isAuthenticated ? (
            <p className="text-xs text-amber-700 flex items-center gap-1.5 font-semibold bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200">
              <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Sign in required for protected modules</span>
            </p>
          ) : !hasValidOrg ? (
            <p className="text-xs text-orange-700 flex items-center gap-1.5 font-bold bg-orange-50 px-3.5 py-1.5 rounded-xl border border-orange-200">
              <Lock className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span>Modules locked — Organization required</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={() => onOpenManageModal(null)}
              className="text-xs font-extrabold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-orange-500" />
              <span>Configure All Modules</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: Active & Enabled Modules */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Active & Enabled Modules</span>
                <span className="text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  {enabledList.length} Active
                </span>
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Applications enabled and ready for staff to launch in this workspace.
              </p>
            </div>
          </div>
        </div>

        {enabledList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enabledList.map((mod, idx) => {
              const isLocked = user && !hasValidOrg;
              return (
                <ModuleCard
                  key={mod.id}
                  module={mod}
                  index={idx}
                  isEnabled={true}
                  isLocked={isLocked}
                  activeOrg={activeOrg}
                  onAction={onCardAction}
                  onDisableDirectly={onDisableDirectly}
                  cardVariants={cardVariants}
                />
              );
            })}
          </div>
        ) : (
          /* Empty State for Enabled Modules */
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">No active modules enabled yet</p>
              <p className="text-xs text-slate-500 font-medium mt-1 max-w-md mx-auto">
                Explore available applications below and click &ldquo;Enable Module&rdquo; to activate POS,
                Inventory, KDS, or Finance for <span className="font-bold text-slate-700">{activeOrg || 'your workspace'}</span>.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: Available to Enable (Not Yet Enabled) */}
      {/* ========================================================================= */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Available Applications to Enable</span>
                <span className="text-xs font-black bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full">
                  {disabledList.length} Available
                </span>
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Click &ldquo;Enable Module&rdquo; on any application to unlock and activate it for this workspace.
              </p>
            </div>
          </div>
        </div>

        {disabledList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {disabledList.map((mod, idx) => {
              const isLocked = user && !hasValidOrg;
              return (
                <ModuleCard
                  key={mod.id}
                  module={mod}
                  index={idx}
                  isEnabled={false}
                  isLocked={isLocked}
                  activeOrg={activeOrg}
                  onAction={onCardAction}
                  onDisableDirectly={onDisableDirectly}
                  cardVariants={cardVariants}
                />
              );
            })}
          </div>
        ) : (
          /* All Modules Enabled Celebration State */
          <div className="bg-emerald-50/60 rounded-3xl border border-emerald-200/80 p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-black text-emerald-900">
              All Enterprise Applications are Active!
            </p>
            <p className="text-xs text-emerald-700 font-medium max-w-md mx-auto">
              Every module in the CodeBridges Enterprise Suite is currently enabled and unlocked for{' '}
              <span className="font-bold">{activeOrg}</span>.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
