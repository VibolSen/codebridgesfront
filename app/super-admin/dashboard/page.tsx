'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDashboardSummaryApi, getDashboardWidgetsApi, getDashboardChartsApi } from '@/lib/api';
import { motion, Variants } from 'framer-motion';
import {
  Monitor,
  Boxes,
  Users,
  ChefHat,
  DollarSign,
  ShoppingBag,
  ShieldCheck,
  Calendar,
  AlertCircle,
  FileText,
  RotateCcw,
  Building2,
  Package,
  Settings,
  Clock,
  Receipt,
  PieChart,
  BarChart3,
  TrendingUp,
  TrendingDown,
  X,
  User,
  ArrowRight,
  ExternalLink,
  Activity,
  Sparkles,
  Layers,
} from 'lucide-react';

interface ModuleOverview {
  id: string;
  name: string;
  category: string;
  description: string;
  href: string;
  icon: any;
  color: string;
  bgLight: string;
  badge: string;
  status: 'Operational' | 'Active' | 'Ready';
}

const ENTERPRISE_MODULES: ModuleOverview[] = [
  {
    id: 'pos',
    name: 'POS Management Suite',
    category: 'Sales & Terminal',
    description: 'Unified Cashier POS Register, KDS, CFD, and Order Fulfillment Desk.',
    href: '/pos',
    icon: Monitor,
    color: 'text-orange-500',
    bgLight: 'bg-orange-500/10 border-orange-500/20',
    badge: 'Core POS',
    status: 'Operational',
  },
  {
    id: 'inventory',
    name: 'Inventory & Stock Engine',
    category: 'Supply Chain',
    description: 'Dual-layer balance ledger, PO receiving, transfers & reorder alerts.',
    href: '/super-admin/inventory',
    icon: Boxes,
    color: 'text-amber-500',
    bgLight: 'bg-amber-500/10 border-amber-500/20',
    badge: 'Stock Ledger',
    status: 'Active',
  },
  {
    id: 'hr',
    name: 'HR & Workforce Hub',
    category: 'Human Capital',
    description: 'Employee profiles, department structure, shift PINs & access matrix.',
    href: '/super-admin/hrm/employees',
    icon: Users,
    color: 'text-blue-500',
    bgLight: 'bg-blue-500/10 border-blue-500/20',
    badge: 'Workforce',
    status: 'Operational',
  },
  {
    id: 'finance',
    name: 'Finance & ABA Reconciliation',
    category: 'Accounting',
    description: 'KHQR payments, ABA Bakong auto-matching & expense ledger.',
    href: '/super-admin/reconciliation',
    icon: DollarSign,
    color: 'text-purple-500',
    bgLight: 'bg-purple-500/10 border-purple-500/20',
    badge: 'Settlements',
    status: 'Ready',
  },
  {
    id: 'shop',
    name: 'E-Commerce Storefront',
    category: 'Digital Web',
    description: 'Customer online catalog, digital KHQR checkout & pickup tracking.',
    href: '/shop',
    icon: ShoppingBag,
    color: 'text-pink-500',
    bgLight: 'bg-pink-500/10 border-pink-500/20',
    badge: 'Public Web',
    status: 'Active',
  },
  {
    id: 'rbac',
    name: 'Dynamic RBAC & Roles',
    category: 'Security',
    description: 'Custom role definitions, granular permissions & audit trail logging.',
    href: '/super-admin/roles',
    icon: ShieldCheck,
    color: 'text-indigo-500',
    bgLight: 'bg-indigo-500/10 border-indigo-500/20',
    badge: 'Security',
    status: 'Operational',
  },
];

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [widgets, setWidgets] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('1Y');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [sumRes, widRes, chartRes] = await Promise.all([
        getDashboardSummaryApi(),
        getDashboardWidgetsApi(),
        getDashboardChartsApi(),
      ]);
      setSummary(sumRes.data);
      setWidgets(widRes.data);
      setCharts(chartRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0);
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.04, duration: 0.35, ease: 'easeOut' as const },
    }),
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Super Admin Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl overflow-hidden border border-slate-800"
      >
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-[11px] font-extrabold uppercase tracking-wider border border-orange-500/30">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              CodeBridges Central Command
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Super Admin Executive Platform Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Centralized platform control panel for Organization & Company Owners. Monitor multi-module operational performance, system health, and dynamic user permissions across all enterprise applications.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 border border-white/10 text-xs font-semibold flex items-center gap-2 backdrop-blur-sm">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>6 Microservices Healthy</span>
            </div>
            <button className="px-4 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              Year 2026 Overview
            </button>
          </div>
        </div>
      </motion.div>

      {/* Enterprise Modules Overview Grid (Centralized Module Management) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-500" />
            Enterprise Modules Suite ({ENTERPRISE_MODULES.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">Single-click module shortcuts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ENTERPRISE_MODULES.map((mod, idx) => {
            const Icon = mod.icon;

            return (
              <motion.div
                key={mod.id}
                custom={idx}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                whileHover={{ y: -3 }}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${mod.bgLight} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${mod.color}`} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {mod.badge}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" title="Microservice Online" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {mod.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {mod.category}
                  </span>
                  <Link
                    href={mod.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    Manage Module
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Primary Financial & Operational Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Suite Gross Revenue */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </span>
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
              +22% YoY
            </span>
          </div>
          <p className="text-xs text-orange-100 font-medium">Platform Gross Revenue</p>
          <h3 className="text-2xl font-extrabold tracking-tight mt-0.5">
            {formatMoney(summary?.metrics?.total_sales || 48988078)}
          </h3>
        </motion.div>

        {/* Active Store Outlets & Registers */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-slate-700/60 shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </span>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
              12 Active Outlets
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Store & Register Network</p>
          <h3 className="text-2xl font-extrabold tracking-tight mt-0.5">
            28 POS Registers
          </h3>
        </motion.div>

        {/* Total Inventory Stock Valuation */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Boxes className="w-5 h-5 text-white" />
            </span>
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
              3 Low Stock Alerts
            </span>
          </div>
          <p className="text-xs text-emerald-100 font-medium">Stock Inventory Valuation</p>
          <h3 className="text-2xl font-extrabold tracking-tight mt-0.5">
            {formatMoney(summary?.metrics?.total_purchase || 24145789)}
          </h3>
        </motion.div>

        {/* Workforce & Dynamic RBAC Roles */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </span>
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
              8 System Roles
            </span>
          </div>
          <p className="text-xs text-blue-100 font-medium">Active Workforce & Staff</p>
          <h3 className="text-2xl font-extrabold tracking-tight mt-0.5">
            148 Employees
          </h3>
        </motion.div>

      </div>

      {/* Analytics & Multi-Module Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales & Purchase Trends */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Multi-Module Operational Performance</h3>
              <div className="flex items-center gap-4 text-xs mt-1">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-200"></span> Inventory PO Receiving
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> POS & E-Commerce Sales
                </span>
              </div>
            </div>

            {/* Timeframe Toggles */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {['1D', '1W', '1M', '3M', '6M', '1Y'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-colors ${
                    timeframe === t
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart Graphics */}
          <div className="h-64 flex items-end justify-between gap-2 pt-6 border-t border-slate-100">
            {(charts?.sales_purchases || [
              { month: 'Jan', purchases: 40, sales: 20 },
              { month: 'Feb', purchases: 50, sales: 25 },
              { month: 'Mar', purchases: 45, sales: 30 },
              { month: 'Apr', purchases: 55, sales: 35 },
              { month: 'May', purchases: 40, sales: 28 },
              { month: 'Jun', purchases: 50, sales: 32 },
              { month: 'July', purchases: 35, sales: 20 },
              { month: 'Aug', purchases: 45, sales: 25 },
              { month: 'Sep', purchases: 60, sales: 45 },
              { month: 'Oct', purchases: 30, sales: 15 },
              { month: 'Nov', purchases: 48, sales: 30 },
              { month: 'Dec', purchases: 52, sales: 35 },
            ]).map((item: any, idx: number) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full max-w-[20px] h-48 bg-slate-100 rounded-t-lg relative flex items-end justify-center overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${item.purchases}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.03 }}
                    className="w-full bg-amber-200 rounded-t-lg"
                  ></motion.div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${item.sales}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.03 + 0.1 }}
                    className="w-full bg-orange-500 rounded-t-lg absolute bottom-0"
                  ></motion.div>
                </div>
                <span className="text-[10px] font-medium text-slate-400">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Info & Customer Channel Distribution */}
        <div className="space-y-6">
          
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Platform Identity Overview</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                <User className="w-5 h-5 text-orange-500 mb-1" />
                <p className="text-[10px] text-slate-500">Suppliers</p>
                <h4 className="text-sm font-bold text-slate-900">6987</h4>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                <Users className="w-5 h-5 text-indigo-500 mb-1" />
                <p className="text-[10px] text-slate-500">Customers</p>
                <h4 className="text-sm font-bold text-slate-900">4896</h4>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                <ShoppingBag className="w-5 h-5 text-emerald-500 mb-1" />
                <p className="text-[10px] text-slate-500">Orders</p>
                <h4 className="text-sm font-bold text-slate-900">487</h4>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Channel Sales Ratio</h3>
              <span className="text-xs text-slate-400">POS vs Web</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-full border-8 border-teal-500 border-t-orange-500 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-slate-400">Ratio</span>
              </div>
              <div className="space-y-2 flex-1">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">79% Retail POS</h4>
                  <p className="text-xs text-slate-400 flex items-center justify-between">
                    <span>In-store Cashier</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +12%
                    </span>
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">21% E-Commerce</h4>
                  <p className="text-xs text-slate-400 flex items-center justify-between">
                    <span>Online Storefront</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +28%
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
