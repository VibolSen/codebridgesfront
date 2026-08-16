'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Monitor,
  Boxes,
  Users,
  ChefHat,
  DollarSign,
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
  Building2,
  LayoutGrid,
  Plus,
} from 'lucide-react';
import { OnboardHeader } from '@/components/header/OnboardHeader';
import { OrganizationManagerBar } from '@/components/OrganizationManagerBar';
import { getAuthToken, getAuthUser } from '@/lib/api';

interface SystemModule {
  id: string;
  title: string;
  category: 'core' | 'operations' | 'finance' | 'security' | 'commerce' | 'saas';
  description: string;
  href: string;
  icon: any;
  gradient: string;
  badge: string;
  features: string[];
  roleRequired?: string;
}

const MODULES_SUITE: SystemModule[] = [
  // 1. Unified POS Management Suite
  {
    id: 'pos-management',
    title: 'POS Terminal & Register',
    category: 'core',
    description: 'Unified cashier register terminal supporting fast touch sales, barcode scanning, split tender, cart holding & shift float audits.',
    href: '/pos',
    icon: Monitor,
    gradient: 'from-orange-500 to-amber-500',
    badge: 'Cashier POS',
    features: [
      'Fast Touch Register & Barcode Scanning',
      'Split-Tender Payments (Cash, Card, KHQR)',
      'Shift Float Open/Close & Cash Drawer Variance',
    ],
    roleRequired: 'Cashier / Supervisor / Admin',
  },

  // 2. Dual-Layer Inventory & Warehouse Operations
  {
    id: 'inventory-suite',
    title: 'Inventory & Warehouse Hub',
    category: 'operations',
    description: 'Real-time stock balance tracking, supplier PO receiving, inter-outlet stock transfers, expiry monitoring & ledger audits.',
    href: '/super-admin/inventory',
    icon: Boxes,
    gradient: 'from-emerald-500 to-teal-600',
    badge: 'Stock Ledger',
    features: [
      'Real-time Multi-Outlet Stock Balances',
      'Supplier Purchase Orders (PO) Receiving',
      'Inter-Outlet Transfers & Wastage Adjustments',
    ],
    roleRequired: 'Stock Clerk / Outlet Manager / Admin',
  },

  // 3. HR & Workforce Management
  {
    id: 'hr-workforce',
    title: 'HR & Workforce Management',
    category: 'operations',
    description: 'Employee profiles, department organization, cashier shift records, 4-digit PIN codes & role access matrix.',
    href: '/super-admin/hrm/employees',
    icon: Users,
    gradient: 'from-indigo-500 to-blue-600',
    badge: 'Workforce Hub',
    features: [
      'Staff Profiles, Phone & 4-Digit PINs',
      'Multi-Level Department Hierarchy',
      'Cashier Shift Audit Logs & Attendance',
    ],
    roleRequired: 'Company Admin / Manager',
  },

  // 4. Finance & ABA Settlement Reconciliation
  {
    id: 'finance-reconciliation',
    title: 'Finance & ABA Reconciliation',
    category: 'finance',
    description: 'Automated daily ABA Bakong settlement reconciliation, expense/income ledgers, profit & loss, and bank accounts.',
    href: '/super-admin/reconciliation',
    icon: DollarSign,
    gradient: 'from-purple-500 to-indigo-600',
    badge: 'Accounting & Settlement',
    features: [
      'Daily Automated ABA Bakong Matching',
      'Discrepancy & Exception Audits',
      'Multi-Account Expense & Income Ledgers',
    ],
    roleRequired: 'Accountant / Admin',
  },

  // 5. Dynamic RBAC & Security Matrix
  {
    id: 'security-rbac',
    title: 'Security & Dynamic RBAC Roles',
    category: 'security',
    description: 'Dynamic custom role creator with 21 granular permissions, staff user accounts, and immutable security audit trails.',
    href: '/super-admin/roles',
    icon: ShieldCheck,
    gradient: 'from-cyan-500 to-blue-600',
    badge: 'Access Control',
    features: [
      '21 Granular Permissions across 7 Modules',
      'Dynamic Custom Role Creation & Assignment',
      'Immutable Security Audit Trail Logs',
    ],
    roleRequired: 'Company Admin / Super Admin',
  },

  // 6. Public E-Commerce Web Storefront
  {
    id: 'public-shop',
    title: 'Public E-Commerce Storefront',
    category: 'commerce',
    description: 'Online customer product catalog, digital cart checkout, instant KHQR payments & order fulfillment tracking.',
    href: '/shop',
    icon: ShoppingBag,
    gradient: 'from-pink-500 to-rose-500',
    badge: 'Public Web Store',
    features: [
      'Online Customer Browsing & Product Search',
      'Instant ABA KHQR Digital Checkout',
      'Self-Pickup & Delivery Order Pipeline',
    ],
  },

  // 7. Kitchen Display System (KDS)
  {
    id: 'kds-suite',
    title: 'Kitchen Display System (KDS)',
    category: 'core',
    description: 'Real-time kitchen order dispatch ticket screen with preparation timers, course ordering & order status triggers.',
    href: '/kds',
    icon: ChefHat,
    gradient: 'from-red-500 to-orange-500',
    badge: 'Kitchen Orders',
    features: [
      'Real-Time POS Order Ticket Dispatch',
      'Kitchen Prep Timers & Overdue Alerts',
      'Bump Bar Status (Prep, Cook, Ready)',
    ],
    roleRequired: 'Kitchen Staff / Manager',
  },

  // 8. Super Admin Platform & SaaS Hub
  {
    id: 'super-admin-dashboard',
    title: 'Platform Super Admin Hub',
    category: 'saas',
    description: 'Central executive control hub to oversee multi-tenant organization workspaces, subscription tiers, and global system health.',
    href: '/super-admin/dashboard',
    icon: Building2,
    gradient: 'from-amber-600 to-orange-600',
    badge: 'Platform Owner',
    features: [
      'Multi-Tenant Client Subscriptions & Billing',
      'Central Multi-Store Outlet Provisioning',
      'Executive Financial & Sales Intelligence',
    ],
    roleRequired: 'Super Admin (Platform Owner)',
  },
];

export function CodeBridgesOnboardingLaunchpad() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [showRequireOrgModal, setShowRequireOrgModal] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    const currentUser = getAuthUser();
    setIsAuthenticated(!!token);
    setUser(currentUser);
  }, []);

  const isSuperAdmin = user?.role === 'super_admin';
  const hasTenant = Boolean(user?.tenant_name || user?.company_name || user?.company);
  const activeOrgSetting = typeof window !== 'undefined' ? localStorage.getItem('active_org') : null;
  const hasSelectedOrg = Boolean(activeOrgSetting && activeOrgSetting !== 'No Organization Yet! Please Create');

  const hasValidOrg = isSuperAdmin || hasTenant || hasSelectedOrg;

  const handleLaunchModule = (mod: SystemModule) => {
    if (!isAuthenticated && mod.roleRequired) {
      window.open(`/login?redirect=${encodeURIComponent(mod.href)}`, '_blank', 'noopener,noreferrer');
      return;
    }

    if (user && !hasValidOrg) {
      setShowRequireOrgModal(true);
      return;
    }

    let targetUrl = mod.href;
    if (user) {
      const userRole = user.role || 'cashier';

      if (mod.id === 'pos-management') {
        if (userRole === 'super_admin' || userRole === 'admin' || userRole === 'administrator') {
          targetUrl = '/super-admin/dashboard';
        } else if (userRole === 'inventory_clerk') {
          targetUrl = '/super-admin/inventory';
        } else if (userRole === 'accountant') {
          targetUrl = '/super-admin/finance/reconciliation';
        } else {
          targetUrl = '/pos';
        }
      }
    }

    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.04, duration: 0.3, ease: 'easeOut' as const },
    }),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Header Bar */}
      <OnboardHeader />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Banner Section */}
        <div className="relative rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white p-8 sm:p-10 shadow-xl shadow-orange-500/15">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 w-full">
            
            {/* Main Top Row: Title Left + Organization Controls Right */}
            <div className="flex flex-wrap items-center justify-between gap-4 relative z-30">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-xs">
                Modular Enterprise <span className="underline decoration-yellow-300 decoration-wavy underline-offset-4">Product Suite</span>
              </h1>

              <div className="shrink-0">
                <OrganizationManagerBar />
              </div>
            </div>

            {/* Description Text */}
            <p className="text-xs sm:text-sm text-orange-50 font-medium leading-relaxed max-w-3xl">
              Launch POS Management, HR Workforce Hub, Finance Reconciliation, and E-Commerce. Single Sign-On grants access tailored to Super Admins (Platform Owners) and Company Administrators.
            </p>
          </div>
        </div>

        {/* Organization Required Banner */}
        {user && !hasValidOrg && (
          <div className="bg-amber-50 border-2 border-amber-300/80 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-amber-900">Organization Required to Unlock System Modules</h4>
                <p className="text-xs text-amber-800 font-medium mt-0.5">
                  You must create or select an active store organization before you can launch POS, Inventory, KDS, or Finance modules.
                </p>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/register-tenant'}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 whitespace-nowrap transition-all cursor-pointer"
            >
              + Create Organization Now
            </button>
          </div>
        )}

        {/* Modules Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-orange-500" />
              Available Enterprise Applications ({MODULES_SUITE.length})
            </h3>
            {!isAuthenticated ? (
              <p className="text-xs text-amber-700 flex items-center gap-1.5 font-semibold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                Sign in required for protected modules
              </p>
            ) : !hasValidOrg && (
              <p className="text-xs text-orange-700 flex items-center gap-1.5 font-bold bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
                <Lock className="w-3.5 h-3.5 text-orange-600" />
                Modules locked — Organization required
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {MODULES_SUITE.map((mod, idx) => {
              const Icon = mod.icon;
              const isLocked = user && !hasValidOrg;

              return (
                <motion.div
                  key={mod.id}
                  custom={idx}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  whileHover={{ y: isLocked ? 0 : -4 }}
                  className={`group rounded-3xl bg-white border p-6 flex flex-col justify-between transition-all relative overflow-hidden ${
                    isLocked
                      ? 'border-slate-200 opacity-80'
                      : 'border-slate-200/80 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/5'
                  }`}
                >
                  {/* Top Badge & Icon */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${mod.gradient} p-0.5 shadow-md`}>
                        <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                          <Icon className="w-6 h-6 text-slate-900 group-hover:scale-110 transition-transform" />
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-[10px] uppercase tracking-wider">
                        {mod.badge}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {mod.title}
                    </h4>

                    <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">
                      {mod.description}
                    </p>

                    {/* Features checklist */}
                    <div className="mt-4 space-y-1.5 pt-3 border-t border-slate-100">
                      {mod.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    {isLocked ? (
                      <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-amber-600" />
                        Organization Setup
                      </span>
                    ) : mod.roleRequired ? (
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400" />
                        {mod.roleRequired}
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        Public Access
                      </span>
                    )}

                    <button
                      onClick={() => handleLaunchModule(mod)}
                      className={`px-4 py-2 rounded-xl text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
                        isLocked
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/20'
                          : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20 group-hover:scale-105'
                      }`}
                    >
                      <span>{isLocked ? 'Enable Module' : 'Launch Module'}</span>
                      {isLocked ? (
                        <Plus className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      )}
                    </button>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>

      </main>

      {/* Require Organization Modal */}
      <AnimatePresence>
        {showRequireOrgModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-5 text-center relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-inner">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Organization Required</h3>
                <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">
                  System modules are locked because you have not created or selected an active store organization yet. Please create your organization to proceed.
                </p>
              </div>
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    setShowRequireOrgModal(false);
                    window.location.href = '/register-tenant';
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs shadow-md shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Organization Now</span>
                </button>
                <button
                  onClick={() => setShowRequireOrgModal(false)}
                  className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 CodeBridges Enterprise Suite. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-600 font-semibold">
            <span>Documentation</span>
            <span>Microservices Status</span>
            <span>Support</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
