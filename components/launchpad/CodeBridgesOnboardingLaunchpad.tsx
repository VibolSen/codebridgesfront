'use client';

import React, { useState, useEffect } from 'react';
import {
  getAuthToken,
  getAuthUser,
  clearAuthToken,
  logoutApi,
  getOutletsApi,
  getUsersApi,
  getSuperAdminTenantsApi,
  getEnabledModulesForOrg,
  fetchAndSyncModulesForOrg,
  enableModuleForOrg,
  disableModuleForOrg,
  getRoleDisplayName,
  getActiveShiftApi,
  OrgItem,
} from '@/lib/api';

import { CATALOG_MODULES } from './types';
import { LaunchpadHeader } from './LaunchpadHeader';
import { LaunchpadOrgBanner } from './LaunchpadOrgBanner';
import { LaunchpadStatsStrip } from './LaunchpadStatsStrip';
import { LaunchpadActiveModules } from './LaunchpadActiveModules';
import { LaunchpadCatalogGrid } from './LaunchpadCatalogGrid';
import { LaunchpadToast } from './LaunchpadToast';

export function CodeBridgesOnboardingLaunchpad() {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [activeOrg, setActiveOrg] = useState<string>('');
  const [userOrganizations, setUserOrganizations] = useState<OrgItem[]>([]);
  const [enabledModules, setEnabledModules] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [staffCount, setStaffCount] = useState<number>(0);
  const [outletsCount, setOutletsCount] = useState<number>(0);
  const [activeShift, setActiveShift] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isTogglingModule, setIsTogglingModule] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const syncUserState = () => {
    const token = getAuthToken();
    const currentUser = getAuthUser();
    setIsAuthenticated(!!token);
    setUser(currentUser);

    if (typeof window !== 'undefined') {
      const storedOrg = localStorage.getItem('active_org') || currentUser?.tenant_name || '';
      setActiveOrg(storedOrg);
      if (storedOrg) {
        refreshEnabledModules(storedOrg);
      }
    }
  };

  const refreshEnabledModules = async (org: string) => {
    if (!org || org === 'No Organization Yet! Please Create') {
      setEnabledModules([]);
      return;
    }
    const cached = getEnabledModulesForOrg(org);
    setEnabledModules(cached);

    try {
      const cloudModules = await fetchAndSyncModulesForOrg(org);
      if (cloudModules && cloudModules.length > 0) {
        setEnabledModules(cloudModules);
      }
    } catch {
      // Keep cached
    }
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
      setStaffCount(0);
      setOutletsCount(0);
      setActiveShift(null);
      return;
    }

    const orgList: OrgItem[] = [];
    const isPlatformOwner = currentUser.role === 'super_admin';
    const userTenantName =
      currentUser.tenant_name || currentUser.company_name || currentUser.company;

    if (userTenantName || isPlatformOwner) {
      orgList.push({
        id: currentUser.tenant_id || 'primary-company',
        name: userTenantName || (isPlatformOwner ? 'CodeBridges Platform Hub' : 'Primary Company'),
        type: 'Company',
      });
    }

    if (currentUser.outlet_id || currentUser.role === 'admin' || isPlatformOwner) {
      try {
        const outletsRes = await getOutletsApi();
        const outletsData = Array.isArray(outletsRes) ? outletsRes : outletsRes?.data || [];
        outletsData.forEach((outlet: any) => {
          orgList.push({
            id: outlet.id,
            name: outlet.name || `Outlet #${outlet.id}`,
            type: 'Outlet',
            code: outlet.code,
          });
        });
        setOutletsCount(outletsData.length);
      } catch (err) {
        console.error('Failed to load outlets:', err);
        setOutletsCount(0);
      }
    } else {
      setOutletsCount(0);
    }

    if (isPlatformOwner) {
      try {
        const tenantsRes = await getSuperAdminTenantsApi();
        const tenantsData = Array.isArray(tenantsRes) ? tenantsRes : tenantsRes?.data || [];
        tenantsData.forEach((t: any) => {
          if (!orgList.some((o) => o.name === t.name)) {
            orgList.push({
              id: t.id,
              name: t.name,
              type: 'Company',
            });
          }
        });
      } catch (err) {
        console.error('Failed to load tenants:', err);
      }
    }

    // Fetch live users / staff headcount
    try {
      const usersRes = await getUsersApi();
      const usersData = Array.isArray(usersRes) ? usersRes : usersRes?.data || [];
      setStaffCount(usersData.length);
    } catch {
      setStaffCount(0);
    }

    // Fetch active register shift
    try {
      const shiftRes = await getActiveShiftApi();
      const shiftData = shiftRes?.data || (shiftRes?.status === 'success' && shiftRes?.data ? shiftRes.data : null);
      setActiveShift(shiftData);
    } catch {
      setActiveShift(null);
    }

    setUserOrganizations(orgList);

    const storedOrg = localStorage.getItem('active_org');
    if (storedOrg && orgList.some((o) => o.name === storedOrg)) {
      setActiveOrg(storedOrg);
      refreshEnabledModules(storedOrg);
    } else if (orgList.length > 0) {
      setActiveOrg(orgList[0].name);
      localStorage.setItem('active_org', orgList[0].name);
      refreshEnabledModules(orgList[0].name);
    } else {
      setActiveOrg('');
      setEnabledModules([]);
    }
  };

  useEffect(() => {
    setMounted(true);
    syncUserState();
    loadOrganizations();

    const handleOrgChange = (e: any) => {
      const orgName = e.detail?.orgName || localStorage.getItem('active_org') || '';
      setActiveOrg(orgName);
      refreshEnabledModules(orgName);
    };

    window.addEventListener('cb_org_changed', handleOrgChange);
    window.addEventListener('cb_user_updated', syncUserState);
    window.addEventListener('cb_modules_changed', (e: any) => {
      if (e.detail?.updated) {
        setEnabledModules(e.detail.updated);
      }
    });
    window.addEventListener('storage', syncUserState);

    return () => {
      window.removeEventListener('cb_org_changed', handleOrgChange);
      window.removeEventListener('cb_user_updated', syncUserState);
      window.removeEventListener('storage', syncUserState);
    };
  }, []);

  const handleCopyOrgId = () => {
    const currentOrgItem = userOrganizations.find((o) => o.name === activeOrg);
    const identifier = currentOrgItem?.id || user?.tenant_id || user?.id || '';
    if (identifier) {
      navigator.clipboard.writeText(String(identifier));
      setCopiedId(true);
      showToast(`Copied Workspace Identifier: ${identifier}`);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      showToast('No Organization Identifier available.');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {}
    clearAuthToken();
    setUser(null);
    setIsAuthenticated(false);
    setShowUserMenu(false);
    syncUserState();
  };

  const handleToggleModule = async (moduleId: string, enable: boolean) => {
    if (!activeOrg || activeOrg === 'No Organization Yet! Please Create') {
      showToast('Please select or create an organization first.');
      return;
    }
    setIsTogglingModule(moduleId);
    try {
      let updated: string[];
      const targetMod = CATALOG_MODULES.find((m) => m.id === moduleId);
      const modName = targetMod?.name || moduleId;

      if (enable) {
        updated = enableModuleForOrg(activeOrg, moduleId);
        showToast(`${modName} activated for ${activeOrg}!`);
      } else {
        updated = disableModuleForOrg(activeOrg, moduleId);
        showToast(`${modName} deactivated.`);
      }
      setEnabledModules(updated);
    } catch (err) {
      console.error('Failed to toggle module:', err);
      showToast('Failed to update module state in cloud database.');
    } finally {
      setIsTogglingModule(null);
    }
  };

  const isModuleEnabled = (modId: string) => {
    if (user?.role === 'super_admin') {
      return true;
    }
    if (modId === 'pos-management') {
      return enabledModules.includes('pos-management') || enabledModules.includes('pos');
    }
    if (modId === 'financial-management' || modId === 'accounting-ledger') {
      return (
        enabledModules.includes('financial-management') ||
        enabledModules.includes('financial') ||
        enabledModules.includes('accounting-ledger') ||
        enabledModules.includes('accounting') ||
        enabledModules.includes('finance')
      );
    }
    return enabledModules.includes(modId);
  };

  const roleTitle = getRoleDisplayName(user, activeOrg);

  const activeOrgItem = userOrganizations.find((o) => o.name === activeOrg);
  const activeOrgId = activeOrgItem?.id || user?.tenant_id || '';

  const displayOrgName =
    activeOrg && activeOrg !== 'No Organization Yet! Please Create'
      ? activeOrg
      : user?.tenant_name || (user?.role === 'super_admin' ? 'CodeBridges Platform Core' : 'No Organization Selected');

  // Filter Active Running Modules strictly from enabledModules
  const activeRunningModules = CATALOG_MODULES.filter((m) => isModuleEnabled(m.id));

  return (
    <div className="min-h-screen bg-[#F0F4F8] font-sans text-slate-900 selection:bg-[#5B4DFB] selection:text-white pb-20">
      {/* Dynamic Toast Notification */}
      <LaunchpadToast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* 1. Top Global Navigation Bar */}
      <LaunchpadHeader
        mounted={mounted}
        isAuthenticated={isAuthenticated}
        user={user}
        roleTitle={roleTitle}
        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}
        onLogout={handleLogout}
      />

      {/* 2. Main Page Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* A & B. Localized Greeting and Organization Identity Banner */}
        <LaunchpadOrgBanner
          user={user}
          roleTitle={roleTitle}
          displayOrgName={displayOrgName}
          activeOrgId={activeOrgId}
          copiedId={copiedId}
          onCopyOrgId={handleCopyOrgId}
          enabledModulesCount={user?.role === 'super_admin' ? CATALOG_MODULES.length : enabledModules.length}
          staffCount={staffCount}
          outletsCount={outletsCount}
        />

        {/* C. 4-Column Micro-Stats Strip */}
        <LaunchpadStatsStrip
          staffCount={staffCount}
          enabledModulesCount={user?.role === 'super_admin' ? CATALOG_MODULES.length : enabledModules.length}
          totalModulesCount={CATALOG_MODULES.length}
          activeShift={activeShift}
          outletsCount={outletsCount}
        />

        {/* D. Section 1: Active Running Modules */}
        <LaunchpadActiveModules
          activeModules={activeRunningModules}
          userRole={user?.role}
          isTogglingModule={isTogglingModule}
          onToggleModule={handleToggleModule}
        />

        {/* E. Section 2: Available Ecosystem Modules */}
        <LaunchpadCatalogGrid
          catalogModules={CATALOG_MODULES}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isModuleEnabled={isModuleEnabled}
          isTogglingModule={isTogglingModule}
          userRole={user?.role}
          onToggleModule={handleToggleModule}
        />
      </main>
    </div>
  );
}
