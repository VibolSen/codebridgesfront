'use client';

import React, { useState, useEffect } from 'react';
import {
  Boxes,
  LayoutDashboard,
  Package,
  Warehouse,
  Truck,
  ShoppingCart,
  Building2,
  SlidersHorizontal,
  BarChart3,
  ShieldCheck,
  Settings,
  Monitor,
  Clock,
  Receipt,
  Tv,
  ChefHat,
} from 'lucide-react';
import { UniversalModuleLayout } from '@/components/module-shell';
import { getOutletsApi, getTransfersApi, getPurchaseOrdersApi } from '@/lib/api';

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  const [counts, setCounts] = useState({
    outlets: 1,
    activeTransfers: 0,
    activePos: 0,
  });

  useEffect(() => {
    async function loadLiveSidebarCounts() {
      try {
        const [outletsRes, transfersRes, posRes] = await Promise.allSettled([
          getOutletsApi(),
          getTransfersApi(),
          getPurchaseOrdersApi(),
        ]);

        const outletsList =
          outletsRes.status === 'fulfilled'
            ? Array.isArray(outletsRes.value)
              ? outletsRes.value
              : outletsRes.value?.data || []
            : [];
        const transfersList =
          transfersRes.status === 'fulfilled'
            ? Array.isArray(transfersRes.value)
              ? transfersRes.value
              : transfersRes.value?.data || []
            : [];
        const posList =
          posRes.status === 'fulfilled'
            ? Array.isArray(posRes.value)
              ? posRes.value
              : posRes.value?.data || []
            : [];

        const activeTransfers = transfersList.filter(
          (t: any) => t.status !== 'completed' && t.status !== 'received'
        ).length;
        const activePos = posList.filter(
          (p: any) => p.status !== 'completed' && p.status !== 'received'
        ).length;

        setCounts({
          outlets: Math.max(1, outletsList.length),
          activeTransfers,
          activePos,
        });
      } catch (err) {
        console.warn('Could not fetch sidebar counts:', err);
      }
    }

    loadLiveSidebarCounts();
  }, []);

  const inventorySidebarSections = [
    {
      items: [
        { label: 'Organization Dashboard', href: '/inventory/dashboard', icon: LayoutDashboard },
        { label: 'Products & SKUs', href: '/inventory/products', icon: Package, badge: 'Live Catalog' },
      ],
    },
    {
      title: 'POS Register & Front-Desk',
      items: [
        { label: 'Checkout Register', href: '/inventory/checkout-register', icon: Monitor, badge: 'Terminal' },
        { label: 'Shifts & Till Float', href: '/inventory/shifts', icon: Clock },
        { label: 'Orders & Receipts', href: '/inventory/orders', icon: Receipt },
        { label: 'Customer Display (CFD)', href: '/inventory/customer-display', icon: Tv },
        { label: 'Kitchen Display (KDS)', href: '/inventory/kitchen-display', icon: ChefHat },
      ],
    },
    {
      title: 'Stock & Multi-Warehouse',
      items: [
        {
          label: 'Warehouse Stock Levels',
          href: '/inventory/stock-warehouses',
          icon: Warehouse,
          badge: `${counts.outlets} ${counts.outlets === 1 ? 'Hub' : 'Hubs'}`,
        },
        {
          label: 'Inter-Warehouse Transfers',
          href: '/inventory/transfers',
          icon: Truck,
          badge: counts.activeTransfers > 0 ? String(counts.activeTransfers) : undefined,
          badgeColor: 'bg-blue-100 text-blue-700',
        },
        {
          label: 'Purchase Orders (POs)',
          href: '/inventory/purchase-orders',
          icon: ShoppingCart,
          badge: counts.activePos > 0 ? String(counts.activePos) : undefined,
          badgeColor: 'bg-purple-100 text-purple-700',
        },
      ],
    },
    {
      title: 'Operations & Hardware',
      items: [
        { label: 'Cashier PINs & Security', href: '/inventory/security', icon: ShieldCheck },
        { label: 'POS Analytics & Reports', href: '/inventory/reports', icon: BarChart3 },
        { label: 'Store & Hardware Settings', href: '/inventory/settings', icon: Settings },
      ],
    },
  ];

  return (
    <UniversalModuleLayout
      currentModuleId="inventory"
      moduleTitle="Inventory & Supply Chain"
      moduleIcon={Boxes}
      moduleBadge="CORE"
      moduleBadgeColor="bg-amber-100 text-amber-800"
      sidebarSections={inventorySidebarSections}
    >
      {children}
    </UniversalModuleLayout>
  );
}
