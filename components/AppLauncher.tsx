'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Grid,
  Monitor,
  Boxes,
  Users,
  ChefHat,
  DollarSign,
  ShoppingBag,
  ShieldCheck,
  Briefcase,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface ModuleItem {
  id: string;
  name: string;
  category: string;
  description: string;
  href: string;
  icon: any;
  color: string;
  bgLight: string;
  badge?: string;
}

export const MODULES_LIST: ModuleItem[] = [
  {
    id: 'pos-management',
    name: 'Point of Sale (POS)',
    category: 'Sales & Terminal',
    description: 'Fast-touch register, dual-currency split tender, shift till auditing, and KDS routing.',
    href: '/pos',
    icon: Monitor,
    color: 'text-orange-600',
    bgLight: 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/20',
    badge: 'Active',
  },
  {
    id: 'inventory',
    name: 'Inventory & Warehouse',
    category: 'Supply Chain',
    description: 'Multi-warehouse stock levels, inter-warehouse transfers, PO 3-way matching, and FIFO valuation.',
    href: '/inventory',
    icon: Boxes,
    color: 'text-amber-600',
    bgLight: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20',
  },
  {
    id: 'crm',
    name: 'CRM & Sales Pipeline',
    category: 'Customer Growth',
    description: 'Deals pipeline Kanban, scored inbound leads, customer activity timeline, and sales forecasting.',
    href: '/crm',
    icon: Briefcase,
    color: 'text-purple-600',
    bgLight: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20',
  },
  {
    id: 'hr',
    name: 'HR & Workforce Hub',
    category: 'Human Capital',
    description: 'Staff employee roster, biometric timesheets, shift PIN security, and payroll studio.',
    href: '/hrm',
    icon: Users,
    color: 'text-blue-600',
    bgLight: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20',
  },
  {
    id: 'finance',
    name: 'Accounting & Finance Ledgers',
    category: 'Financial Operations',
    description: 'Double-entry Chart of Accounts, Accounts Receivable, Accounts Payable, and cash flow.',
    href: '/accounting',
    icon: DollarSign,
    color: 'text-emerald-600',
    bgLight: 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20',
  },
  {
    id: 'admin',
    name: 'Platform Super Admin Hub',
    category: 'Platform Operations',
    description: 'Internal platform console to oversee multi-tenant workspaces, licenses, and system health.',
    href: '/super-admin/dashboard',
    icon: ShieldCheck,
    color: 'text-indigo-600',
    bgLight: 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/20',
    badge: 'Admin',
  },
];

import { getAuthUser } from '@/lib/api';
import { getEnabledModulesForOrg } from '@/lib/modules';

export function AppLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const [enabledModules, setEnabledModules] = useState<string[]>([]);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = getAuthUser();
    const activeOrg = localStorage.getItem('active_org') || user?.tenant_name || user?.company || '';
    if (user?.role === 'super_admin') {
      setEnabledModules(['pos-management', 'inventory', 'crm', 'hr', 'finance', 'admin']);
    } else {
      const cached = getEnabledModulesForOrg(activeOrg);
      setEnabledModules(cached.length > 0 ? cached : ['pos-management', 'pos']);
    }

    const handleOrgChange = (e: any) => {
      const org = e.detail?.orgName || localStorage.getItem('active_org') || '';
      if (user?.role === 'super_admin') {
        setEnabledModules(['pos-management', 'inventory', 'crm', 'hr', 'finance', 'admin']);
      } else {
        const updated = getEnabledModulesForOrg(org);
        setEnabledModules(updated.length > 0 ? updated : ['pos-management', 'pos']);
      }
    };

    window.addEventListener('cb_org_changed', handleOrgChange);
    window.addEventListener('cb_modules_changed', handleOrgChange);

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('cb_org_changed', handleOrgChange);
      window.removeEventListener('cb_modules_changed', handleOrgChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const visibleList = MODULES_LIST.filter((mod) => {
    const user = getAuthUser();
    if (mod.id === 'admin') return user?.role === 'super_admin';
    return true;
  });

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-all flex items-center justify-center border border-slate-200/60 shadow-2xs"
        title="Google Enterprise App Launcher"
      >
        <Grid className="w-5 h-5 text-slate-700" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 mt-3 w-96 rounded-2xl bg-white p-4 shadow-2xl border border-slate-200/80 z-50 overflow-hidden backdrop-blur-md"
          >
            {/* Popover Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 px-1">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-orange-500" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  CodeBridges POS Apps
                </h4>
              </div>
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100 transition-all"
              >
                Onboarding Hub
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Grid of Modules */}
            <div className="grid grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-1">
              {visibleList.map((mod) => {
                const Icon = mod.icon;
                const isActive = pathname === mod.href || (mod.href !== '/' && pathname.startsWith(mod.href));

                return (
                  <Link
                    key={mod.id}
                    href={mod.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className={`group p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-slate-50/70 hover:bg-slate-100/90 text-slate-800 border-slate-200/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-8 h-8 rounded-lg ${mod.bgLight} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : mod.color}`} />
                        </div>
                        {mod.badge && (
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                              isActive ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {mod.badge}
                          </span>
                        )}
                      </div>

                      <h5 className={`text-xs font-bold leading-snug group-hover:translate-x-0.5 transition-transform ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {mod.name}
                      </h5>
                      <p className={`text-[10px] line-clamp-2 mt-0.5 leading-tight ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                        {mod.description}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-200/40 flex items-center justify-between text-[10px] font-semibold">
                      <span className={isActive ? 'text-orange-400' : 'text-slate-400'}>{mod.category}</span>
                      <ExternalLink className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
