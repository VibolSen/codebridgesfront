'use client';

import React from 'react';
import { Monitor } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { UniversalModuleLayout } from '@/components/module-shell';
import { getAuthUser } from '@/lib/api';
import { OrganizationSidebar } from '@/components/sidebars/OrganizationSidebar';

export default function PosLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Cashiers are restricted exclusively to the frontline Cashier Terminal and Customer Display
  React.useEffect(() => {
    const user = getAuthUser();
    if (user?.role === 'cashier' && pathname !== '/pos/terminal' && pathname !== '/pos/customer-display') {
      router.replace('/pos/terminal');
    }
  }, [pathname, router]);

  // Frontline Terminal and Customer CFD are standalone full-screen interfaces
  if (pathname === '/pos/terminal' || pathname === '/pos/customer-display') {
    return <>{children}</>;
  }

  return (
    <UniversalModuleLayout
      currentModuleId="pos"
      moduleTitle="POS Management"
      moduleIcon={Monitor}
      moduleBadge="CORE"
      moduleBadgeColor="bg-purple-100 text-[#5B4DFB]"
      customSidebar={({ sidebarOpen, onToggleSidebar }) => (
        <OrganizationSidebar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={onToggleSidebar}
        />
      )}
    >
      {children}
    </UniversalModuleLayout>
  );
}
