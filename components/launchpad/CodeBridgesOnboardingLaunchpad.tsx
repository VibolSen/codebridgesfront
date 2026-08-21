'use client';

import React, { useState, useEffect } from 'react';
import { Variants } from 'framer-motion';
import { OnboardHeader } from '@/components/header/OnboardHeader';
import {
  getAuthToken,
  getAuthUser,
  getOutletsApi,
  getSuperAdminTenantsApi,
  getEnabledModulesForOrg,
  enableModuleForOrg,
  disableModuleForOrg,
  enableAllModulesForOrg,
  disableAllModulesForOrg,
  OrgItem,
} from '@/lib/api';

import {
  SystemModule,
  MODULES_SUITE,
  LaunchpadToast,
  LaunchpadHeroBanner,
  LaunchpadOrgRequiredBanner,
  ModuleSuiteGrid,
  ManageModulesModal,
  RequireOrgModal,
} from './';

export function CodeBridgesOnboardingLaunchpad() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [activeOrg, setActiveOrg] = useState<string>('');
  const [userOrganizations, setUserOrganizations] = useState<OrgItem[]>([]);
  const [enabledModules, setEnabledModules] = useState<string[]>([]);
  const [showRequireOrgModal, setShowRequireOrgModal] = useState(false);

  // Manage Modules Modal State
  const [showEnableModal, setShowEnableModal] = useState(false);
  const [selectedModuleForEnable, setSelectedModuleForEnable] = useState<SystemModule | null>(null);
  const [targetOrgForEnable, setTargetOrgForEnable] = useState<string>('');
  const [modalSelectedModuleIds, setModalSelectedModuleIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const ALL_MODULE_IDS = MODULES_SUITE.map((m) => m.id);

  const refreshEnabledModules = (org: string) => {
    if (!org || org === 'No Organization Yet! Please Create') {
      setEnabledModules([]);
      return;
    }
    const enabled = getEnabledModulesForOrg(org);
    setEnabledModules(enabled);
  };

  const loadOrganizations = async () => {
    const token = getAuthToken();
    const currentUser = getAuthUser();
    setIsAuthenticated(!!token);
    setUser(currentUser);

    if (!token || !currentUser) {
      setUserOrganizations([]);
      setActiveOrg('');
      setEnabledModules([]);
      return;
    }

    const orgList: OrgItem[] = [];
    const isPlatformOwner = currentUser.role === 'super_admin';
    const userTenantName =
      currentUser.tenant_name || currentUser.company_name || currentUser.company;

    if (userTenantName || isPlatformOwner) {
      orgList.push({
        id: 'primary-company',
        name: userTenantName || 'CodeBridges Enterprise',
        type: 'Company',
      });
    }

    // 2. Fetch Outlets from backend service
    try {
      const outletsRes = await getOutletsApi();
      const outletsData = Array.isArray(outletsRes) ? outletsRes : outletsRes?.data || [];
      outletsData.forEach((outlet: any) => {
        if (!orgList.some((existing) => existing.name.toLowerCase() === (outlet.name || '').toLowerCase())) {
          orgList.push({
            id: `outlet-${outlet.id}`,
            name: outlet.name || `Outlet #${outlet.id}`,
            type: 'Outlet',
            code: outlet.code,
          });
        }
      });
    } catch (err) {
      console.warn('[Launchpad] Outlets fetch failed:', err);
    }

    // 4. Fetch Tenants if Super Admin
    if (currentUser.role === 'super_admin') {
      try {
        const tenantsRes = await getSuperAdminTenantsApi();
        const tenantsData = Array.isArray(tenantsRes) ? tenantsRes : tenantsRes?.data || [];
        tenantsData.forEach((t: any) => {
          if (!orgList.some((existing) => existing.name.toLowerCase() === (t.name || '').toLowerCase())) {
            orgList.push({
              id: `tenant-${t.id}`,
              name: t.name,
              type: 'Tenant',
            });
          }
        });
      } catch (err) {
        console.warn('[Launchpad] Tenants fetch failed:', err);
      }
    }

    setUserOrganizations(orgList);

    const savedOrg = localStorage.getItem('active_org');
    let effectiveOrg = '';
    if (savedOrg && savedOrg !== 'No Organization Yet! Please Create') {
      effectiveOrg = savedOrg;
    } else if (orgList.length > 0) {
      effectiveOrg = orgList[0].name;
      localStorage.setItem('active_org', effectiveOrg);
    }

    setActiveOrg(effectiveOrg);
    refreshEnabledModules(effectiveOrg);
  };

  useEffect(() => {
    loadOrganizations();

    // Check query params for action=enable from registration redirect
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const action = params.get('action');
      const orgParam = params.get('org');
      if (action === 'enable') {
        const target = orgParam || localStorage.getItem('active_org') || '';
        setTargetOrgForEnable(target);
        setSelectedModuleForEnable(null);
        setModalSelectedModuleIds(getEnabledModulesForOrg(target));
        setShowEnableModal(true);
      }
    }

    // Listen to custom organization and module events
    const handleOrgChanged = (e: any) => {
      const newOrg = e.detail?.orgName || localStorage.getItem('active_org') || '';
      setActiveOrg(newOrg);
      refreshEnabledModules(newOrg);
    };

    const handleModulesChanged = () => {
      const currentOrg = localStorage.getItem('active_org') || '';
      refreshEnabledModules(currentOrg);
    };

    window.addEventListener('cb_org_changed', handleOrgChanged);
    window.addEventListener('cb_modules_changed', handleModulesChanged);

    return () => {
      window.removeEventListener('cb_org_changed', handleOrgChanged);
      window.removeEventListener('cb_modules_changed', handleModulesChanged);
    };
  }, []);

  useEffect(() => {
    if (targetOrgForEnable) {
      setModalSelectedModuleIds(getEnabledModulesForOrg(targetOrgForEnable));
    }
  }, [targetOrgForEnable]);

  const isSuperAdmin = user?.role === 'super_admin';
  const hasTenant = Boolean(user?.tenant_name || user?.company_name || user?.company);
  const hasSelectedOrg = Boolean(activeOrg && activeOrg !== 'No Organization Yet! Please Create');
  const hasValidOrg = isSuperAdmin || hasTenant || hasSelectedOrg;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Open Enable / Manage Module modal for single module or all modules
  const handleOpenEnableModal = (mod: SystemModule | null) => {
    if (!isAuthenticated) {
      window.open(
        `/login?redirect=${encodeURIComponent('/CodeBridgesOnboardingLaunchpad')}`,
        '_blank',
        'noopener,noreferrer'
      );
      return;
    }

    if (!hasValidOrg || userOrganizations.length === 0) {
      setShowRequireOrgModal(true);
      return;
    }

    const currentTargetOrg = activeOrg || userOrganizations[0]?.name || '';
    setSelectedModuleForEnable(mod);
    setTargetOrgForEnable(currentTargetOrg);
    setModalSelectedModuleIds(getEnabledModulesForOrg(currentTargetOrg));
    setShowEnableModal(true);
  };

  // Disable a single module directly from the card
  const handleDisableModuleDirectly = (mod: SystemModule, e: React.MouseEvent) => {
    e.stopPropagation();
    const org = activeOrg || userOrganizations[0]?.name;
    if (!org) return;

    disableModuleForOrg(org, mod.id);
    refreshEnabledModules(org);
    showToast(`🔒 "${mod.title}" disabled for "${org}".`);
  };

  // Toggle individual module checkbox in the modal
  const handleToggleModalModule = (moduleId: string) => {
    setModalSelectedModuleIds((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  // Save changes from modal for the chosen organization
  const handleSaveModalChanges = () => {
    if (!targetOrgForEnable) return;

    if (selectedModuleForEnable) {
      const isAlreadyEnabled = enabledModules.includes(selectedModuleForEnable.id);
      if (isAlreadyEnabled) {
        disableModuleForOrg(targetOrgForEnable, selectedModuleForEnable.id);
        showToast(`🔒 "${selectedModuleForEnable.title}" disabled for "${targetOrgForEnable}".`);
      } else {
        enableModuleForOrg(targetOrgForEnable, selectedModuleForEnable.id);
        showToast(`✨ "${selectedModuleForEnable.title}" enabled for "${targetOrgForEnable}"!`);
      }
    } else {
      enableAllModulesForOrg(targetOrgForEnable, modalSelectedModuleIds);
      showToast(
        `💾 Saved enabled modules (${modalSelectedModuleIds.length} active) for "${targetOrgForEnable}"!`
      );
    }

    refreshEnabledModules(activeOrg);
    setShowEnableModal(false);
    setSelectedModuleForEnable(null);
  };

  // Enable All Modules for Target Org
  const handleEnableAllForTargetOrg = () => {
    if (!targetOrgForEnable) return;
    enableAllModulesForOrg(targetOrgForEnable, ALL_MODULE_IDS);
    setModalSelectedModuleIds(ALL_MODULE_IDS);
    refreshEnabledModules(activeOrg);
    showToast(`🎉 All ${MODULES_SUITE.length} modules enabled for "${targetOrgForEnable}"!`);
    setShowEnableModal(false);
    setSelectedModuleForEnable(null);
  };

  // Disable All Modules for Target Org
  const handleDisableAllForTargetOrg = () => {
    if (!targetOrgForEnable) return;
    disableAllModulesForOrg(targetOrgForEnable);
    setModalSelectedModuleIds([]);
    refreshEnabledModules(activeOrg);
    showToast(`🔒 All modules disabled for "${targetOrgForEnable}".`);
    setShowEnableModal(false);
    setSelectedModuleForEnable(null);
  };

  // Action button click on each module card
  const handleCardAction = (mod: SystemModule) => {
    if (!isAuthenticated && mod.roleRequired) {
      window.open(`/login?redirect=${encodeURIComponent(mod.href)}`, '_blank', 'noopener,noreferrer');
      return;
    }

    if (user && (!hasValidOrg || userOrganizations.length === 0)) {
      setShowRequireOrgModal(true);
      return;
    }

    const isEnabled = enabledModules.includes(mod.id);

    if (!isEnabled) {
      handleOpenEnableModal(mod);
      return;
    }

    let targetUrl = mod.href;
    if (user) {
      if (mod.id === 'pos-management') {
        const userRole = (user.role || '').toLowerCase();
        const isManagerial = ['super_admin', 'admin', 'administrator', 'owner', 'outlet_manager', 'manager', 'supervisor'].includes(userRole);
        targetUrl = isManagerial ? '/pos' : '/pos/terminal';
      }
    }

    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.04, duration: 0.3, ease: 'easeOut' as const },
    }),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Header Bar */}
      <OnboardHeader />

      {/* Toast Notification */}
      <LaunchpadToast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 1. Hero Banner Component */}
        <LaunchpadHeroBanner
          user={user}
          hasValidOrg={hasValidOrg}
          enabledCount={enabledModules.length}
          totalModules={MODULES_SUITE.length}
          onOpenManageModal={() => handleOpenEnableModal(null)}
        />

        {/* 2. Organization Required Notice */}
        {user && !hasValidOrg && <LaunchpadOrgRequiredBanner />}

        {/* 3. Modules Grid Component */}
        <ModuleSuiteGrid
          user={user}
          isAuthenticated={isAuthenticated}
          hasValidOrg={hasValidOrg}
          activeOrg={activeOrg}
          enabledModules={enabledModules}
          onCardAction={handleCardAction}
          onDisableDirectly={handleDisableModuleDirectly}
          onOpenManageModal={handleOpenEnableModal}
          cardVariants={cardVariants}
        />
      </main>

      {/* 4. Manage / Enable / Disable Modules Modal */}
      <ManageModulesModal
        isOpen={showEnableModal}
        selectedModule={selectedModuleForEnable}
        targetOrg={targetOrgForEnable}
        userOrganizations={userOrganizations}
        modalSelectedModuleIds={modalSelectedModuleIds}
        isSingleModuleEnabled={
          selectedModuleForEnable ? enabledModules.includes(selectedModuleForEnable.id) : false
        }
        onClose={() => setShowEnableModal(false)}
        onSelectTargetOrg={(org) => setTargetOrgForEnable(org)}
        onToggleModalModule={handleToggleModalModule}
        onSelectAllModules={() => setModalSelectedModuleIds(ALL_MODULE_IDS)}
        onDeselectAllModules={() => setModalSelectedModuleIds([])}
        onSaveModalChanges={handleSaveModalChanges}
        onEnableAllForTargetOrg={handleEnableAllForTargetOrg}
        onDisableAllForTargetOrg={handleDisableAllForTargetOrg}
      />

      {/* 5. Organization Required Modal */}
      <RequireOrgModal
        isOpen={showRequireOrgModal}
        onClose={() => setShowRequireOrgModal(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 CodeBridges Enterprise Suite. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-600 font-semibold">
            <span>Documentation</span>
            <span>Microservices Status</span>
            <span>Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
