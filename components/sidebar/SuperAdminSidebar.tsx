'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Layers,
  CreditCard,
  Users,
  BarChart3,
  Activity,
  LifeBuoy,
  Megaphone,
  ShieldCheck,
  Sliders,
  Package,
  Boxes,
  Tag,
  DollarSign,
  Briefcase,
  Store,
  Key,
  Lock,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Server,
  Zap,
  Gift,
} from 'lucide-react';

interface SuperAdminSidebarProps {
  sidebarOpen: boolean;
  userRole?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  isExternal?: boolean;
}

interface NavGroup {
  id: string;
  title: string;
  icon?: any;
  items: NavItem[];
  allowedRoles: string[];
}

export function SuperAdminSidebar({ sidebarOpen, userRole = 'super_admin' }: SuperAdminSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Internal Super Admin Platform Navigation Groups (The 11 Platform Ops Hubs)
  const platformNavGroups: NavGroup[] = [
    {
      id: 'platform-overview',
      title: 'Platform Overview',
      allowedRoles: ['super_admin'],
      items: [
        { name: 'Global Executive Cockpit', href: '/super-admin/dashboard', icon: LayoutDashboard, badge: 'Live' },
        { name: 'Growth & MRR Velocity', href: '/super-admin/dashboard?tab=growth', icon: BarChart3 },
      ],
    },
    {
      id: 'organizations',
      title: 'Organizations (Tenants)',
      allowedRoles: ['super_admin'],
      items: [
        { name: 'All Organizations', href: '/super-admin/platform/tenants', icon: Building2 },
      ],
    },
    {
      id: 'modules-flags',
      title: 'Modules & Feature Flags',
      allowedRoles: ['super_admin'],
      items: [
        { name: 'Module Registry', href: '/super-admin/platform/modules', icon: Layers },
        { name: 'Tenant Entitlements', href: '/super-admin/platform/modules?tab=entitlements', icon: Sliders },
        { name: 'Beta Feature Flags', href: '/super-admin/platform/modules?tab=flags', icon: Zap },
      ],
    },
    {
      id: 'billing-revenue',
      title: 'Billing & Revenue',
      allowedRoles: ['super_admin'],
      items: [
        { name: 'Subscription Plans & Tiers', href: '/super-admin/finance/billing', icon: CreditCard },
        { name: 'Global Invoices & Failures', href: '/super-admin/finance/billing?tab=invoices', icon: DollarSign },
        { name: 'Revenue & Churn Cohorts', href: '/super-admin/finance/reports', icon: BarChart3 },
      ],
    },
    {
      id: 'platform-users',
      title: 'Platform Users',
      allowedRoles: ['super_admin'],
      items: [
        { name: 'Cross-Tenant User Lookup', href: '/super-admin/platform/users', icon: Users },
        { name: 'Security & Active Sessions', href: '/super-admin/security/users', icon: ShieldCheck },
      ],
    },
    {
      id: 'analytics',
      title: 'Platform Analytics',
      allowedRoles: ['super_admin'],
      items: [
        { name: 'Platform Usage Trends', href: '/super-admin/analytics', icon: BarChart3 },
        { name: 'Module Engagement Heatmap', href: '/super-admin/analytics?tab=engagement', icon: Activity },
      ],
    },
    {
      id: 'system-infra',
      title: 'System & Infrastructure',
      allowedRoles: ['super_admin'],
      items: [
        { name: 'Microservice Health (6/6)', href: '/super-admin/infrastructure', icon: Server, badge: 'Healthy' },
        { name: 'RabbitMQ & Redis Telemetry', href: '/super-admin/infrastructure?tab=queues', icon: Activity },
      ],
    },
    {
      id: 'support-ops',
      title: 'Support & Operations',
      allowedRoles: ['super_admin'],
      items: [
        { name: 'Support Tickets Desk', href: '/super-admin/support', icon: LifeBuoy },
        { name: 'Platform Audit Logs', href: '/super-admin/security/audit-logs', icon: Lock },
      ],
    },
    {
      id: 'announcements',
      title: 'Communications',
      allowedRoles: ['super_admin'],
      items: [
        { name: 'Global Broadcasts', href: '/super-admin/communications', icon: Megaphone },
        { name: 'Changelog & Releases', href: '/super-admin/communications?tab=releases', icon: Tag },
      ],
    },
    {
      id: 'platform-admins',
      title: 'Platform Admins',
      allowedRoles: ['super_admin'],
      items: [
        { name: 'Internal Staff Team', href: '/super-admin/security/platform-admins', icon: ShieldCheck },
        { name: 'Platform RBAC Roles', href: '/super-admin/security/roles', icon: Sliders },
      ],
    },
    {
      id: 'platform-settings',
      title: 'Platform Settings',
      allowedRoles: ['super_admin'],
      items: [
        { name: 'Global Defaults & Trial', href: '/super-admin/settings', icon: Sliders },
        { name: 'Master API Keys (Bakong/SMS)', href: '/super-admin/api-keys', icon: Key },
      ],
    },
  ];

  // Merchant Store Operations Groups (For Org Admins / Store Managers)
  const storeNavGroups: NavGroup[] = [
    {
      id: 'store-overview',
      title: 'Store Dashboard',
      allowedRoles: ['admin', 'administrator', 'tenant_admin', 'outlet_manager', 'inventory_clerk', 'accountant'],
      items: [
        { name: 'Business Overview', href: '/super-admin/dashboard', icon: LayoutDashboard },
        { name: 'POS Management Hub', href: '/pos', icon: Store, isExternal: true },
      ],
    },
    {
      id: 'store-catalog',
      title: 'Catalog & Products',
      allowedRoles: ['admin', 'administrator', 'tenant_admin', 'outlet_manager', 'inventory_clerk'],
      items: [
        { name: 'Products Catalog', href: '/super-admin/catalog/products', icon: Package },
        { name: 'Categories & Brands', href: '/super-admin/catalog/categories', icon: Tag },
        { name: 'Discounts & Coupons', href: '/super-admin/catalog/coupons', icon: Tag },
      ],
    },
    {
      id: 'store-inventory',
      title: 'Inventory & Stock',
      allowedRoles: ['admin', 'administrator', 'tenant_admin', 'outlet_manager', 'inventory_clerk'],
      items: [
        { name: 'Stock Balances', href: '/super-admin/inventory', icon: Boxes },
        { name: 'Stock Transfers', href: '/super-admin/inventory/transfer', icon: Boxes },
        { name: 'Suppliers & Vendors', href: '/super-admin/crm/suppliers', icon: Users },
      ],
    },
    {
      id: 'store-finance',
      title: 'Finance & Accounts',
      allowedRoles: ['admin', 'administrator', 'tenant_admin', 'outlet_manager', 'accountant'],
      items: [
        { name: 'Reconciliation', href: '/super-admin/finance/reconciliation', icon: DollarSign },
        { name: 'Expenses & Income', href: '/super-admin/finance/expenses', icon: DollarSign },
        { name: 'Bank Accounts', href: '/super-admin/finance/bank-accounts', icon: Building2 },
      ],
    },
    {
      id: 'store-hrm',
      title: 'HR & Workforce',
      allowedRoles: ['admin', 'administrator', 'tenant_admin', 'outlet_manager'],
      items: [
        { name: 'Workforce Operations Hub', href: '/hrm', icon: Briefcase },
        { name: 'Employees Directory', href: '/super-admin/hrm/employees', icon: Users },
        { name: 'Departments', href: '/super-admin/hrm/departments', icon: Building2 },
      ],
    },
    {
      id: 'store-crm',
      title: 'CRM & Customers',
      allowedRoles: ['admin', 'administrator', 'tenant_admin', 'outlet_manager'],
      items: [
        { name: 'CRM & Pipeline Hub', href: '/crm', icon: Briefcase },
        { name: 'Customers Directory', href: '/super-admin/crm/customers', icon: Users },
        { name: 'Gift Cards & Vouchers', href: '/super-admin/crm/gift-cards', icon: Gift },
      ],
    },
    {
      id: 'store-settings',
      title: 'Store Settings',
      allowedRoles: ['admin', 'administrator', 'tenant_admin', 'outlet_manager'],
      items: [
        { name: 'Outlets & Registers', href: '/super-admin/security/stores', icon: Store },
        { name: 'Staff Users & Roles', href: '/super-admin/security/users', icon: Users },
      ],
    },
  ];

  const isPlatformSuperAdmin = userRole === 'super_admin';
  const navGroups = isPlatformSuperAdmin ? platformNavGroups : storeNavGroups;

  return (
    <aside
      className={`h-full bg-white border-r border-slate-200 transition-all duration-300 flex flex-col shrink-0 overflow-y-auto ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Super Admin Console Badge */}
      {sidebarOpen && isPlatformSuperAdmin && (
        <div className="px-4 pt-3 pb-1 shrink-0">
          <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[11px] font-black tracking-tight text-orange-950 uppercase">
                Platform Super Admin
              </span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-orange-600 text-white">
              Global
            </span>
          </div>
        </div>
      )}

      {/* Navigation Tree */}
      <div className="p-3 space-y-4 flex-1">
        {navGroups.map((group) => (
          <div key={group.id} className="space-y-1">
            {sidebarOpen && (
              <h4 className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                <span>{group.title}</span>
              </h4>
            )}
            {group.items.map((item, itemIdx) => {
              const IconComp = item.icon;
              const currentTab = searchParams.get('tab');
              const currentStatus = searchParams.get('status');
              let isActive = false;

              if (item.href.includes('?')) {
                const [basePath, queryStr] = item.href.split('?');
                const params = new URLSearchParams(queryStr);
                const itemTab = params.get('tab');
                const itemStatus = params.get('status');
                isActive =
                  pathname === basePath &&
                  Boolean((itemTab && currentTab === itemTab) || (itemStatus && currentStatus === itemStatus));
              } else {
                const isDefaultTab = !currentTab || currentTab === 'overview' || currentTab === 'registry';
                isActive = pathname === item.href && isDefaultTab && !currentStatus;
              }

              return (
                <Link
                  key={itemIdx}
                  href={item.href}
                  target={item.isExternal ? '_blank' : undefined}
                  rel={item.isExternal ? 'noopener noreferrer' : undefined}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 group/item cursor-pointer ${
                    isActive
                      ? 'bg-[#5B4DFB] text-white shadow-md shadow-[#5B4DFB]/20 font-extrabold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-purple-50 hover:translate-x-0.5'
                  }`}
                  title={!sidebarOpen ? item.name : undefined}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <IconComp
                      className={`w-4 h-4 shrink-0 transition-colors duration-150 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover/item:text-[#5B4DFB]'
                      }`}
                    />
                    {sidebarOpen && <span className="truncate">{item.name}</span>}
                  </div>

                  {sidebarOpen && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge && (
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-purple-100 text-[#5B4DFB]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.isExternal && (
                        <ExternalLink
                          className={`w-3 h-3 opacity-60 group-hover/item:opacity-100 ${
                            isActive ? 'text-white' : 'text-slate-400'
                          }`}
                        />
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      {sidebarOpen && (
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold">6/6 Services Online</span>
          </div>
          <span className="font-bold text-slate-400">v2.4.0</span>
        </div>
      )}
    </aside>
  );
}
