'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ModuleSuiteHeader } from './ModuleSuiteHeader';
import { UniversalModuleSidebar, NavSection } from './UniversalModuleSidebar';
import { ImpersonationBanner } from '@/components/ui/ImpersonationBanner';
import { getAuthUser } from '@/lib/api';

interface UniversalModuleLayoutProps {
  currentModuleId: 'pos' | 'crm' | 'hrm' | 'accounting' | 'inventory';
  moduleTitle: string;
  moduleIcon: any;
  moduleBadge?: string;
  moduleBadgeColor?: string;
  sidebarSections?: NavSection[];
  customSidebar?: (props: { sidebarOpen: boolean; onToggleSidebar: () => void }) => React.ReactNode;
  children: React.ReactNode;
}

export function UniversalModuleLayout({
  currentModuleId,
  moduleTitle,
  moduleIcon,
  moduleBadge,
  moduleBadgeColor,
  sidebarSections,
  customSidebar,
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
        {customSidebar ? (
          customSidebar({ sidebarOpen, onToggleSidebar: () => setSidebarOpen(!sidebarOpen) })
        ) : (
          <UniversalModuleSidebar
            moduleName={moduleTitle}
            moduleBadge={moduleBadge}
            moduleBadgeColor={moduleBadgeColor}
            sections={sidebarSections || []}
            sidebarOpen={sidebarOpen}
          />
        )}

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#F0F4F8] p-4 sm:p-6 lg:p-8">
          <React.Suspense
            fallback={
              <div className="h-full w-full flex items-center justify-center p-8 text-xs font-bold text-slate-400">
                Loading module content...
              </div>
            }
          >
            {children}
          </React.Suspense>
        </main>
      </div>
    </div>
  );
}
