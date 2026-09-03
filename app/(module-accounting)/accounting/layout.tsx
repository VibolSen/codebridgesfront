'use client';

import React from 'react';
import {
  DollarSign,
  LayoutDashboard,
  BookOpen,
  ArrowDownLeft,
  ArrowUpRight,
  Landmark,
  FileSpreadsheet,
  BarChart3,
  ShieldCheck,
  Settings,
} from 'lucide-react';
import { UniversalModuleLayout } from '@/components/module-shell';

const ACCOUNTING_SIDEBAR_SECTIONS = [
  {
    items: [
      { label: 'Accounting Dashboard', href: '/accounting', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Ledgers & Cash Flow',
    items: [
      { label: 'Chart of Accounts (COA)', href: '/accounting?tab=coa', icon: BookOpen },
      { label: 'Invoices & Receivables (AR)', href: '/accounting?tab=invoices', icon: ArrowDownLeft },
      { label: 'Bills & Payables (AP)', href: '/accounting?tab=bills', icon: ArrowUpRight },
      { label: 'Bank Feeds & Reconciliation', href: '/accounting?tab=bank', icon: Landmark },
      { label: 'Journal Entries & Vouchers', href: '/accounting?tab=journals', icon: FileSpreadsheet },
    ],
  },
  {
    title: 'Financials & Compliance',
    items: [
      { label: 'P&L & Balance Sheet', href: '/accounting?tab=reports', icon: BarChart3 },
      { label: 'Accounting Access & RBAC', href: '/accounting?tab=access', icon: ShieldCheck },
      { label: 'Accounting Settings', href: '/accounting?tab=settings', icon: Settings },
    ],
  },
];

export default function AccountingLayout({ children }: { children: React.ReactNode }) {
  return (
    <UniversalModuleLayout
      currentModuleId="accounting"
      moduleTitle="Accounting & Finance Suite"
      moduleIcon={DollarSign}
      sidebarSections={ACCOUNTING_SIDEBAR_SECTIONS}
    >
      {children}
    </UniversalModuleLayout>
  );
}
