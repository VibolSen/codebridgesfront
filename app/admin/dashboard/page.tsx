'use client';

import { useState, useEffect } from 'react';
import { getDashboardSummaryApi, getDashboardWidgetsApi, getDashboardChartsApi } from '@/lib/api';
import { motion, Variants } from 'framer-motion';
import {
  Calendar,
  AlertCircle,
  FileText,
  RotateCcw,
  Building2,
  Package,
  Settings,
  Clock,
  Receipt,
  Users,
  ShoppingBag,
  Boxes,
  Camera,
  PieChart,
  BarChart3,
  TrendingUp,
  TrendingDown,
  X,
  User,
} from 'lucide-react';

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
      transition: { delay: i * 0.05, duration: 0.35, ease: 'easeOut' as const },
    }),
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome, Super Admin</h1>
          <p className="text-xs text-slate-500">You have <span className="font-semibold text-orange-500">200+</span> Orders, Today</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            01 Jan 2026 - 07 Jan 2026
          </button>
        </div>
      </motion.div>

      {/* Low Stock Warning Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-800 text-xs flex items-center justify-between shadow-xs"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-600 flex items-center justify-center font-bold text-xs">
            !
          </span>
          <span>
            Your Product <strong className="font-semibold text-slate-900">Apple iPhone 15 is running Low</strong>, already below 5 Pcs.{' '}
            <button className="underline text-orange-600 font-semibold hover:text-orange-500">Add Stock</button>
          </span>
        </div>
        <button className="text-slate-400 hover:text-slate-600 text-base">
          <X className="w-4 h-4" />
        </button>
      </motion.div>

      {/* 4 Top Primary Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Sales */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ y: -4 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg">
              <FileText className="w-5 h-5 text-white" />
            </span>
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
              +22%
            </span>
          </div>
          <p className="text-xs text-orange-100 font-medium">Total Sales</p>
          <h3 className="text-2xl font-extrabold tracking-tight mt-0.5">
            {formatMoney(summary?.metrics?.total_sales || 48988078)}
          </h3>
        </motion.div>

        {/* Total Sales Return */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ y: -4 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-slate-700/60 shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-lg">
              <RotateCcw className="w-5 h-5 text-white" />
            </span>
            <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full">
              -22%
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Total Sales Return</p>
          <h3 className="text-2xl font-extrabold tracking-tight mt-0.5">
            {formatMoney(summary?.metrics?.total_sales_return || 16478145)}
          </h3>
        </motion.div>

        {/* Total Purchase */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ y: -4 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg">
              <Building2 className="w-5 h-5 text-white" />
            </span>
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
              +22%
            </span>
          </div>
          <p className="text-xs text-emerald-100 font-medium">Total Purchase</p>
          <h3 className="text-2xl font-extrabold tracking-tight mt-0.5">
            {formatMoney(summary?.metrics?.total_purchase || 24145789)}
          </h3>
        </motion.div>

        {/* Total Purchase Return */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ y: -4 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg">
              <Package className="w-5 h-5 text-white" />
            </span>
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
              -22%
            </span>
          </div>
          <p className="text-xs text-blue-100 font-medium">Total Purchase Return</p>
          <h3 className="text-2xl font-extrabold tracking-tight mt-0.5">
            {formatMoney(summary?.metrics?.total_purchase_return || 18458747)}
          </h3>
        </motion.div>

      </div>

      {/* 4 Secondary Small Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Profit */}
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-slate-900">$8,458,798</h4>
            <p className="text-xs text-slate-500">Profit</p>
            <span className="text-[10px] font-bold text-emerald-500 mt-1 inline-block">+35% vs Last Month</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold">
            <Settings className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Invoice Due */}
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-slate-900">$48,988.78</h4>
            <p className="text-xs text-slate-500">Invoice Due</p>
            <span className="text-[10px] font-bold text-rose-500 mt-1 inline-block">-19% vs Last Month</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Total Expenses */}
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-slate-900">$8,980,097</h4>
            <p className="text-xs text-slate-500">Total Expenses</p>
            <span className="text-[10px] font-bold text-emerald-500 mt-1 inline-block">+41% vs Last Month</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
            <Receipt className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Total Payment Returns */}
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-slate-900">$78,458,798</h4>
            <p className="text-xs text-slate-500">Total Payment Returns</p>
            <span className="text-[10px] font-bold text-rose-500 mt-1 inline-block">-20% vs Last Month</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-sm font-mono">
            #
          </div>
        </motion.div>

      </div>

      {/* Sales & Purchase Bar Chart + Overall Info & Customers Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales & Purchase Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Sales & Purchase</h3>
              <div className="flex items-center gap-4 text-xs mt-1">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-200"></span> Total Purchase 49K
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Total Sales 38K
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

        {/* Overall Info & Customer Ratio */}
        <div className="space-y-6">
          
          {/* Overall Information Cards */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Overall Information</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <motion.div whileHover={{ y: -2 }} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                <User className="w-5 h-5 text-orange-500 mb-1" />
                <p className="text-[10px] text-slate-500">Suppliers</p>
                <h4 className="text-sm font-bold text-slate-900">6987</h4>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                <Users className="w-5 h-5 text-indigo-500 mb-1" />
                <p className="text-[10px] text-slate-500">Customer</p>
                <h4 className="text-sm font-bold text-slate-900">4896</h4>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                <ShoppingBag className="w-5 h-5 text-emerald-500 mb-1" />
                <p className="text-[10px] text-slate-500">Orders</p>
                <h4 className="text-sm font-bold text-slate-900">487</h4>
              </motion.div>
            </div>
          </div>

          {/* Customers Overview Donut Breakdown */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Customers Overview</h3>
              <span className="text-xs text-slate-400">Today v</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-full border-8 border-teal-500 border-t-orange-500 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-slate-400">Ratio</span>
              </div>
              <div className="space-y-2 flex-1">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">5.5K</h4>
                  <p className="text-xs text-slate-400 flex items-center justify-between">
                    <span>First Time</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> 79%
                    </span>
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">3.5K</h4>
                  <p className="text-xs text-slate-400 flex items-center justify-between">
                    <span>Return</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> 71%
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Triple Columns: Top Selling, Low Stock, Recent Sales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Top Selling Products */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-orange-500" />
              Top Selling Products
            </h3>
            <span className="text-xs text-slate-400">Today v</span>
          </div>
          <div className="space-y-3">
            {(widgets?.top_selling || []).map((item: any, idx: number) => (
              <motion.div
                whileHover={{ x: 4 }}
                key={idx}
                className="flex items-center justify-between text-xs p-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center font-bold">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{item.name}</h4>
                    <p className="text-slate-400">${item.price} • {item.sales_count} Sales</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {item.change || '+25%'}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Boxes className="w-4 h-4 text-rose-500" />
              Low Stock Products
            </h3>
            <button className="text-xs text-orange-500 font-semibold hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {(widgets?.low_stock || []).map((item: any, idx: number) => (
              <motion.div
                whileHover={{ x: 4 }}
                key={idx}
                className="flex items-center justify-between text-xs p-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Camera className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{item.name}</h4>
                    <p className="text-slate-400">ID: {item.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Instock</span>
                  <span className="text-xs font-bold text-rose-500">{item.in_stock}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              Recent Sales
            </h3>
            <span className="text-xs text-slate-400">Today v</span>
          </div>
          <div className="space-y-3">
            {(widgets?.recent_sales || []).map((item: any, idx: number) => (
              <motion.div
                whileHover={{ x: 4 }}
                key={idx}
                className="flex items-center justify-between text-xs p-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{item.customer || 'Apple Watch'}</h4>
                    <p className="text-slate-400">${item.grand_total || item.total || 640}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                  item.status === 'Cancelled' ? 'bg-rose-50 text-rose-600' :
                  'bg-indigo-50 text-indigo-600'
                }`}>
                  {item.status || 'Processing'}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
