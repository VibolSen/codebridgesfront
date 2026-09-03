'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  Users,
  UserCheck,
  Building2,
  CreditCard,
  TicketPercent,
  BarChart3,
  Receipt,
  Settings,
  ShieldCheck,
  History,
  Monitor,
  ChevronDown,
  ChevronRight,
  Search,
  ArrowUpRight,
  X,
  Store,
  Clock,
  Sparkles,
} from 'lucide-react';
import { getRoleDisplayName } from '@/lib/api';

export interface PosSidebarNavSubItem {
  name: string;
  href: string;
  badge?: string;
  isExternal?: boolean;
}

export interface PosSidebarNavGroup {
  id: string;
  title: string;
  icon: any;
  href?: string;
  badge?: string;
  items?: PosSidebarNavSubItem[];
}

interface PosSidebarProps {
  sidebarOpen?: boolean;
  isMobileOpen?: boolean;
  onCloseMobileSidebar?: () => void;
  user?: any;
  activeShift?: any;
  onOpenShiftModal?: () => void;
  onCloseShiftModal?: () => void;
}

export function PosSidebar({
  sidebarOpen = false,
  isMobileOpen,
  onCloseMobileSidebar,
  user,
  activeShift,
  onOpenShiftModal,
  onCloseShiftModal,
}: PosSidebarProps) {
  const isDrawerOpen = isMobileOpen !== undefined ? isMobileOpen : sidebarOpen;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'sales-orders': true,
    'products': false,
    'inventory': false,
    'reports': false,
  });

  const fullUrl = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`;

  const navGroups: PosSidebarNavGroup[] = [
    // 1. 📊 Dashboard
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/pos',
      badge: 'Live',
    },

    // 2. 🛒 Sales / Orders
    {
      id: 'sales-orders',
      title: 'Sales / Orders',
      icon: ShoppingCart,
      items: [
        { name: 'All Orders', href: '/pos/orders' },
        { name: 'Refunds / Returns', href: '/pos/orders?tab=refunds' },
        { name: 'Held Orders', href: '/pos?section=held-orders' },
      ],
    },

    // 3. 📦 Products
    {
      id: 'products',
      title: 'Products',
      icon: Package,
      items: [
        { name: 'All Products', href: '/super-admin/catalog/products' },
        { name: 'Categories', href: '/super-admin/catalog/categories' },
        { name: 'Variants & Modifiers', href: '/super-admin/catalog/products?view=variants' },
        { name: 'Bulk Import / Export', href: '/super-admin/catalog/products?view=import-export' },
      ],
    },

    // 4. 📥 Inventory
    {
      id: 'inventory',
      title: 'Inventory',
      icon: Boxes,
      items: [
        { name: 'Stock Levels', href: '/super-admin/inventory' },
        { name: 'Stock Adjustments', href: '/super-admin/inventory?tab=adjustments' },
        { name: 'Purchase Orders (POs)', href: '/super-admin/inventory/purchase-orders' },
        { name: 'Suppliers & Vendors', href: '/super-admin/crm/suppliers' },
        { name: 'Inter-Branch Transfers', href: '/super-admin/inventory?tab=transfers' },
      ],
    },

    // 5. 👥 Customers
    {
      id: 'customers',
      title: 'Customers',
      icon: Users,
      items: [
        { name: 'Customer List', href: '/super-admin/crm/customers' },
        { name: 'Loyalty & Points Program', href: '/super-admin/crm/customers?tab=loyalty' },
        { name: 'Customer Groups & Tiers', href: '/super-admin/crm/customers?tab=groups' },
      ],
    },

    // 6. 👤 Employees / Staff
    {
      id: 'staff',
      title: 'Employees / Staff',
      icon: UserCheck,
      items: [
        { name: 'Staff List', href: '/super-admin/hrm/employees' },
        { name: 'Roles & Permissions', href: '/super-admin/security/roles' },
        { name: 'Shift & Attendance Logs', href: '/pos/shifts' },
        { name: 'Sales Performance', href: '/super-admin/finance/reports?type=sales_by_cashier' },
      ],
    },

    // 7. 🏬 Branches / Outlets
    {
      id: 'branches',
      title: 'Branches / Outlets',
      icon: Building2,
      items: [
        { name: 'Branch List', href: '/super-admin/platform/tenants?tab=outlets' },
        { name: 'Branch-wise Reports', href: '/super-admin/finance/reports?type=sales_by_outlet' },
      ],
    },

    // 8. 💳 Payments
    {
      id: 'payments',
      title: 'Payments',
      icon: CreditCard,
      items: [
        { name: 'Payment Methods Setup', href: '/super-admin/finance/bank-accounts' },
        { name: 'Transaction & Settlement Logs', href: '/super-admin/finance/reconciliation' },
      ],
    },

    // 9. 🎟 Promotions
    {
      id: 'promotions',
      title: 'Promotions',
      icon: TicketPercent,
      items: [
        { name: 'Discounts & Pricing Rules', href: '/super-admin/catalog/coupons?tab=discounts' },
        { name: 'Coupons & Vouchers', href: '/super-admin/catalog/coupons' },
        { name: 'Combo Deals & Bundles', href: '/super-admin/catalog/coupons?tab=combos' },
      ],
    },

    // 10. 📈 Reports
    {
      id: 'reports',
      title: 'Reports',
      icon: BarChart3,
      items: [
        { name: 'Sales Report', href: '/super-admin/finance/reports?type=daily_sales' },
        { name: 'Inventory Report', href: '/super-admin/finance/reports?type=inventory_valuation' },
        { name: 'Profit & Loss', href: '/super-admin/finance/reports?type=profit_loss' },
        { name: 'Tax Report', href: '/super-admin/finance/reports?type=tax_summary' },
        { name: 'Void / Refund Report', href: '/super-admin/finance/reports?type=refunds_voids' },
      ],
    },

    // 11. 🧾 Taxes
    {
      id: 'taxes',
      title: 'Taxes',
      icon: Receipt,
      href: '/super-admin/settings?tab=taxes',
      badge: 'VAT',
    },

    // 12. ⚙️ Settings
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      items: [
        { name: 'Store Info & Branding', href: '/super-admin/settings?tab=store' },
        { name: 'Receipt Template Customizer', href: '/super-admin/settings?tab=receipt' },
        { name: 'Tax Configuration', href: '/super-admin/settings?tab=taxes' },
        { name: 'Printer & Hardware Setup', href: '/super-admin/settings?tab=hardware' },
        { name: 'Notifications & Alerts', href: '/super-admin/settings?tab=notifications' },
        { name: 'Integrations & Accounting', href: '/super-admin/settings?tab=integrations' },
      ],
    },

    // 13. 🔐 Roles & Permissions
    {
      id: 'roles',
      title: 'Roles & Permissions',
      icon: ShieldCheck,
      href: '/super-admin/security/roles',
      badge: 'RBAC',
    },

    // 14. 📜 Activity Logs / Audit Trail
    {
      id: 'audit-logs',
      title: 'Activity Logs / Audit Trail',
      icon: History,
      href: '/super-admin/security/audit-logs',
      badge: 'Audit',
    },
  ];

  // Auto-expand active group based on current URL
  useEffect(() => {
    navGroups.forEach((group) => {
      if (group.items) {
        const hasActiveSub = group.items.some(
          (item) => pathname === item.href || fullUrl === item.href
        );
        if (hasActiveSub) {
          setOpenGroups((prev) => ({ ...prev, [group.id]: true }));
        }
      }
    });
  }, [pathname, fullUrl]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Filter navigation by search query
  const filteredNavGroups = navGroups
    .map((group) => {
      if (!searchQuery.trim()) return group;
      const q = searchQuery.toLowerCase();
      const groupMatch = group.title.toLowerCase().includes(q);
      if (group.items) {
        const filteredItems = group.items.filter((item) => item.name.toLowerCase().includes(q));
        if (groupMatch || filteredItems.length > 0) {
          return {
            ...group,
            items: groupMatch ? group.items : filteredItems,
          };
        }
        return null;
      }
      return groupMatch ? group : null;
    })
    .filter(Boolean) as PosSidebarNavGroup[];

  const isLinkActive = (href?: string) => {
    if (!href) return false;
    if (href === '/pos') {
      return pathname === '/pos' && !searchParams?.get('section');
    }
    return pathname === href || fullUrl === href;
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobileSidebar}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Sidebar Panel - Light Theme (Dreams POS Design System) */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white text-slate-700 border-r border-slate-200/90 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-xs ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 sm:px-5 flex items-center justify-between border-b border-slate-200/80 bg-white shrink-0">
          <Link href="/pos" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-slate-900 tracking-tight">CodeBridges</span>
                <span className="px-1.5 py-0.5 rounded-md bg-orange-50 text-orange-600 border border-orange-200 text-[9px] font-black uppercase tracking-widest">
                  POS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Enterprise Cockpit</p>
            </div>
          </Link>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onCloseMobileSidebar}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Cashier Terminal Quick Launch Banner */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/pos/terminal"
              className="w-full py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 flex items-center justify-between group transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
                  <Monitor className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-black uppercase tracking-wider">Cashier Register</div>
                  <div className="text-[10px] text-orange-100 font-medium">Launch Touch Terminal</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Search Navigation Bar */}
        <div className="px-3 pt-3 pb-2 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search POS navigation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8.5 pr-3 py-1.5 rounded-xl bg-slate-100/70 border border-slate-200/80 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Categories List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
          {filteredNavGroups.map((group) => {
            const Icon = group.icon;
            const hasSubItems = Boolean(group.items && group.items.length > 0);
            const isOpen = openGroups[group.id] ?? false;
            const isActive = isLinkActive(group.href);

            // Standalone Direct Link
            if (!hasSubItems && group.href) {
              return (
                <Link
                  key={group.id}
                  href={group.href}
                  onClick={onCloseMobileSidebar}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 font-black'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{group.title}</span>
                  </div>
                  {group.badge && (
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-orange-50 text-orange-700 border border-orange-200'
                      }`}
                    >
                      {group.badge}
                    </span>
                  )}
                </Link>
              );
            }

            // Collapsible Group Accordion
            return (
              <div key={group.id} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{group.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {group.badge && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        {group.badge}
                      </span>
                    )}
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Submenu Accordion Drawer */}
                <AnimatePresence initial={false}>
                  {isOpen && group.items && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-7 pr-1 space-y-0.5"
                    >
                      {group.items.map((subItem) => {
                        const isSubActive = isLinkActive(subItem.href);
                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={onCloseMobileSidebar}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                              isSubActive
                                ? 'bg-orange-50 text-orange-600 font-extrabold border border-orange-200/80 shadow-2xs'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
                            }`}
                          >
                            <span className="truncate">{subItem.name}</span>
                            {subItem.badge && (
                              <span className="text-[8px] font-black px-1 rounded bg-slate-100 text-slate-600">
                                {subItem.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Shift Drawer Status & Profile Footer */}
        <div className="p-3 border-t border-slate-200/80 bg-slate-50/70 shrink-0 space-y-2">
          {/* Active Shift Indicator */}
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  activeShift ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`}
              />
              <div>
                <div className="text-[10px] font-black text-slate-800">
                  {activeShift ? 'Shift Active' : 'Shift Closed'}
                </div>
                <div className="text-[9px] text-slate-500 font-medium">
                  {activeShift ? `Float: $${activeShift.opening_float || '0.00'}` : 'Drawer offline'}
                </div>
              </div>
            </div>

            {activeShift ? (
              <button
                type="button"
                onClick={onCloseShiftModal}
                className="text-[10px] font-black px-2 py-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
              >
                Close
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenShiftModal}
                className="text-[10px] font-black px-2 py-1 rounded-lg bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-500 hover:text-white transition-all cursor-pointer"
              >
                Open Float
              </button>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center justify-between px-1 text-slate-500 text-xs">
            <div className="flex items-center gap-2 truncate min-w-0">
              <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-black shrink-0">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="min-w-0 truncate">
                <div className="text-[11px] font-bold text-slate-800 truncate">
                  {user?.name || 'Staff User'}
                </div>
                <div className="text-[9px] text-orange-600 font-extrabold truncate">
                  {getRoleDisplayName(user)}
                </div>
              </div>
            </div>
            <Link
              href="/"
              title="Return to Launchpad Suite"
              className="text-[10px] font-bold text-slate-500 hover:text-orange-600 p-1.5 rounded hover:bg-slate-200/60 transition-colors shrink-0"
            >
              Exit
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
