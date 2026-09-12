'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogIn } from 'lucide-react';
import { CreateOrgModal } from '@/components/tenant';
import { AppIcons } from '@/components/ui/icons';
import { buttonStyles } from '@/lib/theme';
import { useOrganizationSwitcher, OrgItem } from './useOrganizationSwitcher';

export type { OrgItem };

export function OrganizationManagerBar() {
  const {
    router,
    showOrgDropdown,
    setShowOrgDropdown,
    setShowCreateDropdown,
    isCreateModalOpen,
    setIsCreateModalOpen,
    createModalType,
    setCreateModalType,
    user,
    organizations,
    activeOrg,
    dropdownRef,
    handleSelectOrg,
    handleOrgCreated,
  } = useOrganizationSwitcher();

  return (
    <div
      className="relative inline-flex items-center gap-2 z-50"
      ref={dropdownRef}
    >
      {/* All Organizations Dropdown Button */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setShowOrgDropdown(!showOrgDropdown);
            setShowCreateDropdown(false);
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 text-xs font-black text-slate-800 transition-all cursor-pointer shadow-2xs"
        >
          <AppIcons.Organization className="w-3.5 h-3.5 text-brand" />
          <span className="truncate max-w-[130px] sm:max-w-[180px]">{activeOrg}</span>
          <AppIcons.Dropdown className="w-3 h-3 text-slate-400" />
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {showOrgDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 z-50 text-slate-800 text-xs space-y-1.5"
            >
              <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase border-b border-slate-100 mb-1 flex items-center justify-between">
                <span>Your Workspaces &amp; Outlets</span>
                {user && (
                  <span className="text-[9px] bg-brand-subtle text-brand px-1.5 py-0.5 rounded font-extrabold border border-brand-border">
                    API SYNCED
                  </span>
                )}
              </div>

              {!user ? (
                /* Unauthenticated Guest State */
                <div className="p-3 text-center space-y-2">
                  <p className="text-slate-600 font-medium text-xs">
                    Sign in to access your organization workspaces and store outlets.
                  </p>
                  <button
                    onClick={() => {
                      setShowOrgDropdown(false);
                      router.push('/login');
                    }}
                    className={`w-full ${buttonStyles.primary}`}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In Now</span>
                  </button>
                </div>
              ) : organizations.length === 0 ? (
                /* Authenticated but no organization created */
                <div className="p-3 text-center text-slate-600 font-medium space-y-2">
                  <p className="text-xs font-semibold text-slate-700">No organization created yet!</p>
                  <button
                    onClick={() => {
                      setShowOrgDropdown(false);
                      setCreateModalType('company');
                      setIsCreateModalOpen(true);
                    }}
                    className={`w-full ${buttonStyles.primary}`}
                  >
                    <AppIcons.Plus className="w-3.5 h-3.5" />
                    <span>Create Organization</span>
                  </button>
                </div>
              ) : (
                /* Real Organization & Outlet List */
                organizations.map((org) => {
                  const isSelected = activeOrg === org.name;
                  const Icon = org.type === 'Personal' ? User : AppIcons.Organization;

                  return (
                    <button
                      key={org.id}
                      onClick={() => handleSelectOrg(org.name)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left ${
                        isSelected
                          ? 'bg-brand-subtle text-brand font-extrabold border border-brand-border'
                          : 'text-slate-700 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className="w-4 h-4 text-slate-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold">{org.name}</p>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                            {org.type}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <AppIcons.Check className="w-4 h-4 text-brand shrink-0 ml-1" />
                      )}
                    </button>
                  );
                })
              )}

              {/* Register New Tenant Link */}
              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  onClick={() => {
                    setShowOrgDropdown(false);
                    setCreateModalType('company');
                    setIsCreateModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-brand hover:bg-brand-subtle font-bold text-xs transition-colors cursor-pointer"
                >
                  <AppIcons.Plus className="w-4 h-4 text-brand" />
                  <span>Register New Workspace</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Plus Button for Create New Organization */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setCreateModalType('company');
            setIsCreateModalOpen(true);
            setShowOrgDropdown(false);
            setShowCreateDropdown(false);
          }}
          className="bg-slate-100 hover:bg-slate-200/90 text-slate-800 font-extrabold text-sm w-9 h-9 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center transition-all cursor-pointer"
          title="Create New Organization"
        >
          <AppIcons.Plus className="w-4 h-4 text-slate-800" />
        </motion.button>
      </div>

      {/* Instant Popup Create Organization Modal */}
      <CreateOrgModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        initialType={createModalType}
        onOrgCreated={handleOrgCreated}
      />
    </div>
  );
}
