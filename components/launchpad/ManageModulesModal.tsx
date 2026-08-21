'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders,
  X,
  Building2,
  Store,
  User,
  Check,
  PowerOff,
  Sparkles,
} from 'lucide-react';
import { SystemModule, MODULES_SUITE } from './types';
import { OrgItem, getEnabledModulesForOrg } from '@/lib/api';

interface ManageModulesModalProps {
  isOpen: boolean;
  selectedModule: SystemModule | null;
  targetOrg: string;
  userOrganizations: OrgItem[];
  modalSelectedModuleIds: string[];
  isSingleModuleEnabled: boolean;
  onClose: () => void;
  onSelectTargetOrg: (orgName: string) => void;
  onToggleModalModule: (moduleId: string) => void;
  onSelectAllModules: () => void;
  onDeselectAllModules: () => void;
  onSaveModalChanges: () => void;
  onEnableAllForTargetOrg: () => void;
  onDisableAllForTargetOrg: () => void;
}

export function ManageModulesModal({
  isOpen,
  selectedModule,
  targetOrg,
  userOrganizations,
  modalSelectedModuleIds,
  isSingleModuleEnabled,
  onClose,
  onSelectTargetOrg,
  onToggleModalModule,
  onSelectAllModules,
  onDeselectAllModules,
  onSaveModalChanges,
  onEnableAllForTargetOrg,
  onDisableAllForTargetOrg,
}: ManageModulesModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-800 space-y-5 relative max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {selectedModule
                    ? `Configure ${selectedModule.title}`
                    : 'Configure Modules for Organization'}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Enable or disable application modules for your store workspaces:
                </p>
              </div>
            </div>

            {/* Target Organization Selector (if multiple exist) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Target Organization Workspace
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                {userOrganizations.map((org) => {
                  const isSelected = targetOrg === org.name;
                  const orgCount = getEnabledModulesForOrg(org.name).length;
                  const Icon =
                    org.type === 'Personal' ? User : org.type === 'Outlet' ? Store : Building2;

                  return (
                    <button
                      key={org.id}
                      type="button"
                      onClick={() => onSelectTargetOrg(org.name)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/80 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isSelected ? 'text-orange-600' : 'text-slate-500'
                          }`}
                        />
                        <div className="min-w-0">
                          <p className="font-extrabold text-xs text-slate-900 truncate">
                            {org.name}
                          </p>
                          <span className="text-[9px] text-slate-400 font-semibold uppercase">
                            {org.type}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0 ml-1">
                        {orgCount}/{MODULES_SUITE.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Module Selection Checklist (When in full manage mode) */}
            {!selectedModule && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Enabled Modules for &quot;{targetOrg}&quot;
                  </label>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={onSelectAllModules}
                      className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={onDeselectAllModules}
                      className="text-[11px] font-bold text-slate-500 hover:underline cursor-pointer"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {MODULES_SUITE.map((mod) => {
                    const isChecked = modalSelectedModuleIds.includes(mod.id);
                    const Icon = mod.icon;

                    return (
                      <div
                        key={mod.id}
                        onClick={() => onToggleModalModule(mod.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? 'border-emerald-300 bg-emerald-50/50'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isChecked ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {mod.title}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">
                              {mod.badge}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              isChecked
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {isChecked ? 'ENABLED' : 'DISABLED'}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                              isChecked
                                ? 'border-emerald-500 bg-emerald-500 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Single Module Mode details */}
            {selectedModule && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                    <selectedModule.icon className="w-5 h-5 text-orange-500" />
                    <span>{selectedModule.title}</span>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isSingleModuleEnabled
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    Currently: {isSingleModuleEnabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {selectedModule.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              {selectedModule ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  {isSingleModuleEnabled ? (
                    <button
                      onClick={onSaveModalChanges}
                      className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <PowerOff className="w-4 h-4" />
                      <span>Disable for &quot;{targetOrg}&quot;</span>
                    </button>
                  ) : (
                    <button
                      onClick={onSaveModalChanges}
                      className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Enable for &quot;{targetOrg}&quot;</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={onSaveModalChanges}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Save Changes for &quot;{targetOrg}&quot;</span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={onEnableAllForTargetOrg}
                      className="flex-1 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Enable All</span>
                    </button>
                    <button
                      onClick={onDisableAllForTargetOrg}
                      className="flex-1 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <PowerOff className="w-3.5 h-3.5" />
                      <span>Disable All</span>
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-1.5 text-slate-400 hover:text-slate-600 font-semibold text-xs transition-colors text-center cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
