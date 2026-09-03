'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowDownLeft, ArrowUpRight, Wallet, Loader2 } from 'lucide-react';
import {
  getBankAccountsApi,
  getExpensesApi,
  getSalesReportApi,
  getPurchaseOrdersApi,
} from '@/lib/api';

export function AccountingKpiCards() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    liquidCash: 0,
    accountsReceivable: 0,
    accountsPayable: 0,
    netProfit: 0,
    arCount: 0,
    apCount: 0,
    bankAccountsCount: 0,
  });

  useEffect(() => {
    async function loadKpiData() {
      try {
        setLoading(true);
        const [bankRes, expRes, salesRes, poRes] = await Promise.allSettled([
          getBankAccountsApi(),
          getExpensesApi(),
          getSalesReportApi(),
          getPurchaseOrdersApi(),
        ]);

        let liquidCash = 0;
        let bankAccountsCount = 0;
        if (bankRes.status === 'fulfilled') {
          const accounts = Array.isArray(bankRes.value) ? bankRes.value : bankRes.value?.data || [];
          bankAccountsCount = accounts.length;
          liquidCash = accounts.reduce(
            (acc: number, item: any) => acc + (parseFloat(item.balance || item.current_balance || '0') || 0),
            0
          );
        }

        let totalExpenses = 0;
        if (expRes.status === 'fulfilled') {
          const expList = Array.isArray(expRes.value) ? expRes.value : expRes.value?.data || [];
          totalExpenses = expList.reduce(
            (acc: number, item: any) => acc + (parseFloat(item.amount || '0') || 0),
            0
          );
        }

        let totalSales = 0;
        let uncollectedAr = 0;
        let arCount = 0;
        if (salesRes.status === 'fulfilled' && salesRes.value?.data) {
          const s = salesRes.value.data;
          totalSales = parseFloat(s.total_sales || s.revenue || '0') || 0;
          uncollectedAr = parseFloat(s.unpaid_amount || '0') || 0;
          arCount = parseInt(s.unpaid_orders_count || '0', 10) || 0;
        }

        let accountsPayable = 0;
        let apCount = 0;
        if (poRes.status === 'fulfilled') {
          const poList = Array.isArray(poRes.value) ? poRes.value : poRes.value?.data || [];
          const pendingPos = poList.filter((p: any) => p.status !== 'cancelled');
          apCount = pendingPos.length;
          accountsPayable = pendingPos.reduce(
            (acc: number, item: any) => acc + (parseFloat(item.total_cost || item.amount || '0') || 0),
            0
          );
        }

        const netProfit = totalSales - totalExpenses;

        setMetrics({
          liquidCash,
          accountsReceivable: uncollectedAr,
          accountsPayable,
          netProfit,
          arCount,
          apCount,
          bankAccountsCount,
        });
      } catch (err) {
        console.error('Failed to load accounting KPI metrics:', err);
      } finally {
        setLoading(false);
      }
    }

    loadKpiData();
  }, []);

  const cards = [
    {
      title: 'Total Liquid Cash',
      value: loading ? '...' : `$${metrics.liquidCash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `${metrics.bankAccountsCount} Connected Bank Account${metrics.bankAccountsCount === 1 ? '' : 's'}`,
      change: 'Real-time ledger balance',
      isPositive: true,
      icon: Wallet,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
    },
    {
      title: 'Accounts Receivable (AR)',
      value: loading ? '...' : `$${metrics.accountsReceivable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `${metrics.arCount} Uncollected Order${metrics.arCount === 1 ? '' : 's'}`,
      change: 'Customer pending payments',
      isPositive: true,
      icon: ArrowDownLeft,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'Accounts Payable (AP)',
      value: loading ? '...' : `$${metrics.accountsPayable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `${metrics.apCount} Active Purchase Order${metrics.apCount === 1 ? '' : 's'}`,
      change: 'Vendor disbursement commitments',
      isPositive: false,
      icon: ArrowUpRight,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
    },
    {
      title: 'Operating Net Profit (MTD)',
      value: loading ? '...' : `$${metrics.netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: metrics.netProfit >= 0 ? 'Positive Operating Cash Flow' : 'Deficit / Overhead High',
      change: 'Gross revenue minus recorded expenses',
      isPositive: metrics.netProfit >= 0,
      icon: DollarSign,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, idx) => {
        const IconComp = c.icon;
        return (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{c.title}</span>
              <div className={`w-9 h-9 rounded-xl ${c.bg} ${c.color} flex items-center justify-center`}>
                <IconComp className="w-4 h-4" />
              </div>
            </div>

            <div className="my-3">
              <p className="text-2xl font-black text-slate-900 tracking-tight font-mono">{c.value}</p>
              <p className="text-xs text-slate-400 font-semibold">{c.subtitle}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center gap-1 text-[11px] font-extrabold text-slate-500">
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
              ) : (
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{c.change}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
