'use client';

import React from 'react';
import {
  Monitor,
  LayoutDashboard,
  Receipt,
  Clock,
  Tv,
  ChefHat,
  BarChart3,
  ShieldCheck,
  Settings,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { UniversalModuleLayout } from '@/components/module-shell';
import { getAuthUser } from '@/lib/api';

const POS_SIDEBAR_SECTIONS = [
  {
    items: [
      { label: 'POS Dashboard', href: '/pos', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Sales & Terminal Fleet',
    items: [
      { label: 'Checkout Terminal', href: '/pos/terminal', icon: Monitor, badge: 'Live', badgeColor: 'bg-orange-100 text-orange-700' },
      { label: 'Orders & Receipts', href: '/pos/orders', icon: Receipt },
      { label: 'Shifts & Till Float', href: '/pos/shifts', icon: Clock },
      { label: 'Customer Display (CFD)', href: '/pos/customer-display', icon: Tv },
      { label: 'Kitchen Display (KDS)', href: '/kds', icon: ChefHat },
    ],
  },
  {
    title: 'Analytics & Security',
    items: [
      { label: 'POS Reports', href: '/pos/reports', icon: BarChart3 },
      { label: 'POS Access & PINs', href: '/pos/access', icon: ShieldCheck },
      { label: 'Terminal Settings', href: '/pos/settings', icon: Settings },
    ],
  },
];

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
      moduleTitle="Point of Sale (POS)"
      moduleIcon={Monitor}
      moduleBadge="CORE"
      moduleBadgeColor="bg-orange-100 text-orange-800"
      sidebarSections={POS_SIDEBAR_SECTIONS}
    >
      {children}
    </UniversalModuleLayout>
  );
}
