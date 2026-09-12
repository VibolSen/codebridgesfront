'use client';

import React from 'react';
import { CATALOG_MODULES } from './types';
import { LaunchpadHeader } from './LaunchpadHeader';
import { LaunchpadOrgBanner } from './LaunchpadOrgBanner';
import { LaunchpadStatsStrip } from './LaunchpadStatsStrip';
import { LaunchpadActiveModules } from './LaunchpadActiveModules';
import { LaunchpadCatalogGrid } from './LaunchpadCatalogGrid';
import { LaunchpadToast } from './LaunchpadToast';
import { useLaunchpadState } from './useLaunchpadState';
import { SubscriptionHubModal } from '@/components/ui';

export function CodeBridgesOnboardingLaunchpad() {
  const {
    mounted,
    isAuthenticated,
    user,
    roleTitle,
    showUserMenu,
    setShowUserMenu,
    handleLogout,
    displayOrgName,
    activeOrgId,
    copiedId,
    handleCopyOrgId,
    staffCount,
    outletsCount,
    activeShift,
    toastMessage,
    setToastMessage,
    activeRunningModules,
    searchTerm,
    setSearchTerm,
    isModuleEnabled,
    isTogglingModule,
    handleToggleModule,
    enabledModules,
    showSubscriptionModal,
    setShowSubscriptionModal,
  } = useLaunchpadState();

  const totalEffectiveModules =
    user?.role === 'super_admin' ? CATALOG_MODULES.length : enabledModules.length;

  return (
    <div className="min-h-screen bg-canvas font-sans text-slate-900 selection:bg-brand selection:text-white pb-20">
      {/* Dynamic Toast Notification */}
      <LaunchpadToast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Google One-Style Subscription & Quota Hub Modal */}
      <SubscriptionHubModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        user={user}
        activeOrgName={displayOrgName}
      />

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
          enabledModulesCount={totalEffectiveModules}
          staffCount={staffCount}
          outletsCount={outletsCount}
        />

        {/* C. 4-Column Micro-Stats Strip */}
        <LaunchpadStatsStrip
          staffCount={staffCount}
          enabledModulesCount={totalEffectiveModules}
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
          onOpenSubscriptionModal={() => setShowSubscriptionModal(true)}
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
          onOpenSubscriptionModal={() => setShowSubscriptionModal(true)}
        />
      </main>
    </div>
  );
}
