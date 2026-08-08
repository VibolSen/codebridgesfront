'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Boxes,
  Tag,
  RefreshCw,
  Percent,
  ShoppingBag,
  DollarSign,
  Users,
  Briefcase,
  Layers,
  FileText,
  Gift,
  Clock,
  ShieldCheck,
  Printer,
  QrCode,
  ArrowRightLeft,
  Receipt,
  Building2,
  UserCheck,
  Plus,
  Monitor,
} from 'lucide-react';

interface SuperAdminSidebarProps {
  sidebarOpen: boolean;
  userRole?: string;
}

export function SuperAdminSidebar({ sidebarOpen, userRole = 'admin' }: SuperAdminSidebarProps) {
  const pathname = usePathname();

  const allNavGroups = [
    {
      title: 'Main',
      allowedRoles: ['super_admin', 'admin', 'outlet_manager', 'inventory_clerk', 'accountant'],
      items: [
        { name: 'Super Admin Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Super Admin', href: '#', icon: ShieldCheck },
      ],
    },
    {
      title: 'Inventory',
      allowedRoles: ['super_admin', 'admin', 'outlet_manager', 'inventory_clerk'],
      items: [
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Create Product', href: '/admin/products?action=create', icon: Plus },
        { name: 'Expired Products', href: '/admin/inventory/expired', icon: Clock },
        { name: 'Low Stocks', href: '/admin/inventory?status=low_stock', icon: Boxes },
        { name: 'Category', href: '/admin/categories', icon: Tag },
        { name: 'Sub Category', href: '/admin/categories?type=sub', icon: Layers },
        { name: 'Brands', href: '/admin/brands', icon: Tag },
        { name: 'Print Barcode', href: '#', icon: Printer },
        { name: 'Print QR Code', href: '#', icon: QrCode },
      ],
    },
    {
      title: 'Stock',
      allowedRoles: ['super_admin', 'admin', 'outlet_manager', 'inventory_clerk'],
      items: [
        { name: 'Manage Stock', href: '/admin/inventory', icon: Boxes },
        { name: 'Stock Adjustment Ledger', href: '/admin/inventory/ledger', icon: RefreshCw },
        { name: 'Stock Transfer', href: '#', icon: ArrowRightLeft },
      ],
    },
    {
      title: 'Sales',
      allowedRoles: ['super_admin', 'admin', 'outlet_manager', 'accountant'],
      items: [
        { name: 'Sales', href: '#', icon: DollarSign },
        { name: 'Invoices', href: '#', icon: FileText },
        { name: 'Sales Return', href: '#', icon: RefreshCw },
        { name: 'POS Terminal', href: '/pos', icon: Monitor },
      ],
    },
    {
      title: 'Promo',
      allowedRoles: ['super_admin', 'admin', 'outlet_manager'],
      items: [
        { name: 'Coupons', href: '#', icon: Percent },
        { name: 'Gift Card', href: '#', icon: Gift },
        { name: 'Discount', href: '#', icon: Tag },
      ],
    },
    {
      title: 'Purchases',
      allowedRoles: ['super_admin', 'admin', 'outlet_manager', 'accountant'],
      items: [
        { name: 'Purchases', href: '#', icon: ShoppingBag },
        { name: 'Purchase Order', href: '#', icon: Receipt },
      ],
    },
    {
      title: 'Finance & Accounts',
      allowedRoles: ['super_admin', 'admin', 'outlet_manager', 'accountant'],
      items: [
        { name: 'Expenses', href: '#', icon: DollarSign },
        { name: 'Income', href: '#', icon: DollarSign },
        { name: 'Bank Accounts', href: '#', icon: Building2 },
      ],
    },
    {
      title: 'Peoples & Staff',
      allowedRoles: ['super_admin', 'admin', 'outlet_manager'],
      items: [
        { name: 'Users (RBAC)', href: '/admin/users', icon: ShieldCheck },
        { name: 'Customers', href: '/admin/customers', icon: Users },
        { name: 'Suppliers', href: '/admin/suppliers', icon: UserCheck },
        { name: 'Stores', href: '/admin/stores', icon: Building2 },
      ],
    },
    {
      title: 'HRM',
      allowedRoles: ['super_admin', 'admin', 'outlet_manager'],
      items: [
        { name: 'Employees', href: '/admin/hrm/employees', icon: Briefcase },
        { name: 'Departments', href: '/admin/hrm/departments', icon: Building2 },
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
      <div className="p-3 space-y-6">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {sidebarOpen && (
              <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {group.title}
              </h4>
            )}
            {group.items.map((item, itemIdx) => {
              const IconComp = item.icon;
              const isActive =
                pathname === item.href ||
                (item.name.includes('Dashboard') && pathname.includes('/admin/dashboard'));
              return (
                <Link
                  key={itemIdx}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-orange-50 text-orange-600 font-bold border-r-4 border-orange-500'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title={!sidebarOpen ? item.name : undefined}
                >
                  <IconComp className="w-4 h-4 shrink-0" />
                  {sidebarOpen && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default SuperAdminSidebar;
