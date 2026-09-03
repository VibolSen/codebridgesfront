'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ModuleSuiteHeader } from './ModuleSuiteHeader';
import { UniversalModuleSidebar, NavSection } from './UniversalModuleSidebar';
import { ImpersonationBanner } from '@/components/header/ImpersonationBanner';
import { getAuthUser } from '@/lib/api';

interface UniversalModuleLayoutProps {
  currentModuleId: 'pos' | 'crm' | 'hrm' | 'accounting' | 'inventory';
  moduleTitle: string;
  moduleIcon: any;
  moduleBadge?: string;
  moduleBadgeColor?: string;
  sidebarSections: NavSection[];
  children: React.ReactNode;
}

export function UniversalModuleLayout({
  currentModuleId,
  moduleTitle,
  moduleIcon,
  moduleBadge,
  moduleBadgeColor,
  sidebarSections,
  children,
}: UniversalModuleLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const user = getAuthUser();
    if (user?.role === 'cashier') {
      router.replace('/pos/terminal');
    }
  }, [router]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* 1. Impersonation Alert Banner */}
      <ImpersonationBanner />

      {/* 2. Top Header Bar */}
      <ModuleSuiteHeader
        currentModuleId={currentModuleId}
        moduleTitle={moduleTitle}
        moduleIcon={moduleIcon}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* 3. Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Module Sidebar */}
        <UniversalModuleSidebar
          moduleName={moduleTitle}
          moduleBadge={moduleBadge}
          moduleBadgeColor={moduleBadgeColor}
          sections={sidebarSections}
          sidebarOpen={sidebarOpen}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#F0F4F8] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
