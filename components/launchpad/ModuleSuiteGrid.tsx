'use client';

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import {
  LayoutGrid,
  Lock,
  Sliders,
  CheckCircle2,
  Monitor,
  Boxes,
  DollarSign,
  Users,
  Briefcase,
  ChefHat,
  Tv,
  Store,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { SystemModule, MODULES_SUITE, POS_INTEGRATED_SERVICES } from './types';
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
  return (
    <div className="space-y-8 font-sans">
      {/* ========================================================================= */}
      {/* SECTION HEADER: POS Operating System */}
      {/* ========================================================================= */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/15">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>Point of Sale Management</span>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Active System</span>
              </span>
            </h3>
            {activeOrg && activeOrg !== 'No Organization Yet! Please Create' ? (
              <p className="text-xs text-slate-500 font-medium">
                Workspace:{' '}
                <span className="font-extrabold text-orange-600">{activeOrg}</span> •{' '}
                <span className="font-bold text-emerald-600">8 Integrated Services Ready</span>
              </p>
            ) : (
              <p className="text-xs text-slate-500 font-medium">
                Select or create a store organization to launch your POS system.
              </p>
            )}
          </div>
        </div>

        {/* Right Status / Actions */}
        <div>
          {!isAuthenticated ? (
            <p className="text-xs text-amber-700 flex items-center gap-1.5 font-semibold bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200">
              <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Sign in required</span>
            </p>
          ) : !hasValidOrg ? (
            <p className="text-xs text-orange-700 flex items-center gap-1.5 font-bold bg-orange-50 px-3.5 py-2 rounded-xl border border-orange-200">
              <Lock className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span>Org Required</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={() => onOpenManageModal(null)}
              className="text-xs font-extrabold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-orange-500" />
              <span>Configure Services</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* POS MANAGEMENT SYSTEM CARD (Single Master Card) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MODULES_SUITE.map((mod, idx) => {
          const isEnabled =
            enabledModules.includes(mod.id) ||
            enabledModules.includes('pos-management') ||
            enabledModules.includes('pos');
          const isLocked = Boolean(user && !hasValidOrg);
          return (
            <ModuleCard
              key={mod.id}
              module={mod}
              index={idx}
              isEnabled={isEnabled}
              isLocked={isLocked}
              activeOrg={activeOrg}
              onAction={onCardAction}
              onDisableDirectly={onDisableDirectly}
              cardVariants={cardVariants}
            />
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* INTEGRATED POS SERVICES QUICK-ACCESS MATRIX */}
      {/* ========================================================================= */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span>Integrated POS Ecosystem Services</span>
              <span className="text-[10px] font-extrabold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                {POS_INTEGRATED_SERVICES.length} Built-In
              </span>
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Instant operational shortcuts into your synchronized POS services.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {POS_INTEGRATED_SERVICES.map((service, sIdx) => {
            const IconComp = service.icon;
            const isExternalTarget =
              service.href.includes('/terminal') ||
              service.href.includes('/customer-display') ||
              service.href.includes('/kds');

            return (
              <motion.div
                key={service.id}
                custom={sIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sIdx * 0.03, duration: 0.25 }}
                whileHover={{ y: -2 }}
              >
                <Link
                  href={service.href}
                  target={isExternalTarget ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="group p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-orange-300 hover:shadow-md hover:shadow-orange-500/5 transition-all flex flex-col justify-between h-full cursor-pointer"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl ${service.bgColor} ${service.color} flex items-center justify-center font-bold group-hover:scale-105 transition-transform`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      {service.badge && (
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                          {service.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h5 className="font-extrabold text-xs text-slate-900 group-hover:text-orange-600 transition-colors">
                        {service.name}
                      </h5>
                      <p className="text-[11px] text-slate-500 font-medium leading-snug mt-0.5 line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/50 flex items-center justify-between text-[11px] font-bold text-orange-600 group-hover:text-orange-700">
                    <span>Launch</span>
                    {isExternalTarget ? (
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
