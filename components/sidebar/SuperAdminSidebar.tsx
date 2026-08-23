'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Boxes,
  Tag,
  ShoppingBag,
  Users,
  UserCheck,
  Building2,
  Briefcase,
  Printer,
  QrCode,
  ArrowRightLeft,
  RefreshCw,
  Clock,
  Percent,
  Gift,
  Receipt,
  DollarSign,
  ShieldCheck,
  Monitor,
  FileCheck2,
  BarChart3,
  ChefHat,
  LayoutGrid,
  Settings,
  ExternalLink,
  Lock,
  Key,
  Globe,
  UserPlus,
} from 'lucide-react';

interface SuperAdminSidebarProps {
  sidebarOpen: boolean;
  userRole?: string;
}

export function SuperAdminSidebar({ sidebarOpen, userRole = 'admin' }: SuperAdminSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const dashboardTitle =
    userRole === 'super_admin'
      ? 'Super Admin Platform Hub'
      : userRole === 'admin'
      ? 'Admin Control Hub'
      : userRole === 'outlet_manager'
      ? 'Outlet Manager Hub'
      : 'Control Hub';

  const allNavGroups = [
    {
      title: 'Main Hub',
      allowedRoles: ['super_admin', 'admin', 'outlet_manager', 'inventory_clerk', 'accountant'],
      items: [
        { name: dashboardTitle, href: '/super-admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'POS & Operations',
      allowedRoles: ['super_admin', 'admin', 'outlet_manager', 'accountant'],
      items: [
        { name: 'POS Terminal', href: '/pos', icon: Monitor, isExternal: true },
        { name: 'Kitchen Display (KDS)', href: '/kds', icon: ChefHat, isExternal: true },
        { name: 'Customer Display (CFD)', href: '/pos/customer-display', icon: Monitor, isExternal: true },
        { name: 'Online Order Desk', href: '/super-admin/platform/orders', icon: ShoppingBag },
        { name: 'Restaurant Tables', href: '/super-admin/catalog/tables', icon: LayoutGrid },
      ],
    },
    {
      title: 'Catalog & Products',
      allowedRoles: ['super_admin', 'admin', 'outlet_manager', 'inventory_clerk'],
      items: [
        { name: 'Products Catalog', href: '/super-admin/catalog/products', icon: Package },
        { name: 'Categories', href: '/super-admin/catalog/categories', icon: Tag },
        { name: 'Brands', href: '/super-admin/catalog/brands', icon: Tag },
        { name: 'Print Barcodes', href: '/super-admin/catalog/barcodes', icon: Printer },
        { name: 'Print QR Codes', href: '/super-admin/catalog/qrcodes', icon: QrCode },
      ],
    },
    {
      title: 'Stock & Inventory',
      allowedRoles: ['super_admin', 'admin', 'outlet_manager', 'inventory_clerk'],
      items: [
        { name: 'Manage Stock Balances', href: '/super-admin/inventory', icon: Boxes },
        { name: 'Low Stock Warnings', href: '/super-admin/inventory?status=low_stock', icon: Boxes },
        { name: 'Purchases History', href: '/super-admin/inventory/purchases', icon: ShoppingBag },
        { name: 'Purchase Orders (POs)', href: '/super-admin/inventory/purchase-orders', icon: Receipt },
      ],
    },
    {
      title: 'CRM & Vendors',
      allowedRoles: ['super_admin', 'admin', 'outlet_manager', 'accountant'],
      items: [
        { name: 'Customer Profiles', href: '/super-admin/crm/customers', icon: Users },
        { name: 'Suppliers & Vendors', href: '/super-admin/crm/suppliers', icon: UserCheck },
        { name: 'Gift Cards', href: '/super-admin/crm/gift-cards', icon: Gift },
      ],
    },
    {
      title: 'Human Capital & HR',
      allowedRoles: ['super_admin', 'admin', 'outlet_manager'],
      items: [
        { name: 'Employee Workforce', href: '/super-admin/hrm/employees', icon: Briefcase },
        { name: 'Department Structure', href: '/super-admin/hrm/departments', icon: Building2 },
      ],
    },
    {
      title: 'Finance & Accounts',
      allowedRoles: ['super_admin', 'admin', 'outlet_manager', 'accountant'],
      items: [
        { name: 'ABA Reconciliation', href: '/super-admin/finance/reconciliation', icon: FileCheck2 },
        { name: 'Expense Ledger', href: '/super-admin/finance/expenses', icon: DollarSign },
        { name: 'Income Ledger', href: '/super-admin/finance/income', icon: DollarSign },
        { name: 'Bank Accounts', href: '/super-admin/finance/bank-accounts', icon: Building2 },
        { name: 'Financial Margin Reports', href: '/super-admin/finance/reports', icon: BarChart3 },
      ],
    },
    {
      title: 'Promotions & Web',
      allowedRoles: ['super_admin', 'admin', 'outlet_manager'],
      items: [
        { name: 'Public E-Commerce', href: '/shop', icon: Monitor, isExternal: true },
        { name: 'Coupons', href: '/super-admin/catalog/coupons', icon: Percent },
        { name: 'Discount Rules', href: '/super-admin/catalog/discounts', icon: Tag },
      ],
    },
    {
      title: 'System & Security',
      allowedRoles: ['super_admin', 'admin'],
      items: [
        { name: 'Stores & Outlets', href: '/super-admin/security/stores', icon: Building2 },
        { name: 'User Accounts', href: '/super-admin/security/users', icon: Users },
        { name: 'Dynamic Roles & RBAC', href: '/super-admin/security/roles', icon: ShieldCheck },
        { name: 'Security Audit Logs', href: '/super-admin/security/audit-logs', icon: Lock },
        { name: 'Developer API Keys', href: '/super-admin/api-keys', icon: Key },
        { name: 'System Settings', href: '/super-admin/security/settings', icon: Settings },
      ],
    },
    {
      title: 'SaaS Platform',
      allowedRoles: ['super_admin'],
      items: [
        { name: 'Client Tenant Accounts', href: '/super-admin/platform/tenants', icon: Globe },
        { name: 'Client Registration Portal', href: '/register-tenant', icon: UserPlus, isExternal: true },
      ],
    },
  ];

  const navGroups = allNavGroups.filter((g) => g.allowedRoles.includes(userRole));

  return (
    <aside
      className={`h-full bg-white border-r border-slate-200 transition-all duration-300 flex flex-col shrink-0 overflow-y-auto ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="p-3 space-y-5">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {sidebarOpen && (
              <h4 className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                {group.title}
              </h4>
            )}
            {group.items.map((item, itemIdx) => {
              const IconComp = item.icon;
              const currentStatus = searchParams.get('status');
              let isActive = false;

              if (item.href.includes('?')) {
                const [basePath, queryStr] = item.href.split('?');
                const params = new URLSearchParams(queryStr);
                const itemStatus = params.get('status');
                isActive = pathname === basePath && currentStatus === itemStatus;
              } else {
                isActive =
                  (pathname === item.href && (!currentStatus || item.href !== '/super-admin/inventory')) ||
                  (item.name.includes('Hub') && pathname.includes('/super-admin/dashboard'));
              }

              return (
                <Link
                  key={itemIdx}
                  href={item.href}
                  target={item.isExternal ? '_blank' : undefined}
                  rel={item.isExternal ? 'noopener noreferrer' : undefined}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all group/item ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title={!sidebarOpen ? item.name : undefined}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover/item:text-orange-500'}`} />
                    {sidebarOpen && <span className="truncate">{item.name}</span>}
                  </div>
                  {sidebarOpen && item.isExternal && (
                    <ExternalLink className={`w-3 h-3 opacity-60 group-hover/item:opacity-100 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}
