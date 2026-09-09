import {
  Monitor,
  Boxes,
  Users,
  ChefHat,
  DollarSign,
  Package,
  ShieldCheck,
  Building2,
  Tag,
  Briefcase,
  Store,
  Tv,
  Activity,
  Zap,
  TrendingUp,
} from 'lucide-react';

export interface PosServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  href: string;
  icon: any;
  color: string;
  bgColor: string;
  badge?: string;
}

export interface SystemModule {
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
  isCore?: boolean;
}

export const POS_INTEGRATED_SERVICES: PosServiceItem[] = [
  {
    id: 'pos-terminal',
    name: 'Cashier Register Terminal',
    category: 'Sales & Checkout',
    description: 'Fast-touch barcode scanning, dual-currency split tender (USD/KHR), cart parking & instant checkout.',
    href: '/pos/terminal',
    icon: Monitor,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    badge: 'Frontline Kiosk',
  },
  {
    id: 'pos-dashboard',
    name: 'POS Operations Cockpit',
    category: 'Sales Management',
    description: 'Shift float balancing, safe drops, Z-reports, completed sales & return receipts ledger.',
    href: '/pos',
    icon: Store,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    badge: 'Manager View',
  },
  {
    id: 'inventory-service',
    name: 'Inventory & Stock Logistics',
    category: 'Supply Chain',
    description: 'Real-time multi-warehouse stock levels, low-stock safety buffers, and supplier purchase orders.',
    href: '/inventory',
    icon: Boxes,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    badge: 'Stock Ledger',
  },
  {
    id: 'finance-service',
    name: 'Financial & Bank Settlement',
    category: 'Financial Operations',
    description: 'Double-entry General Ledger, daily ABA/NBC Bakong reconciliation, AR invoices & AP supplier bills.',
    href: '/financial',
    icon: DollarSign,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    badge: 'Finance Hub',
  },
  {
    id: 'hrm-service',
    name: 'Staff, PINs & Workforce',
    category: 'Human Capital',
    description: 'Employee profiles, 4-digit POS register PIN quick-switch, timesheets & automated monthly payroll.',
    href: '/hrm',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    badge: 'Staff & PINs',
  },
  {
    id: 'crm-service',
    name: 'Customer CRM & B2B Deals',
    category: 'Customer Growth',
    description: 'Customer loyalty profiles, wholesale corporate contracts, inbound lead conversion & sales pipeline.',
    href: '/crm',
    icon: Briefcase,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    badge: 'Deals Pipeline',
  },
  {
    id: 'kds-service',
    name: 'Kitchen Display System (KDS)',
    category: 'Fulfillment',
    description: 'Real-time kitchen order ticket dispatch screen with preparation timers, course ordering & bump bar.',
    href: '/kds',
    icon: ChefHat,
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
    badge: 'Kitchen Orders',
  },
  {
    id: 'cfd-service',
    name: 'Customer Display Screen (CFD)',
    category: 'Customer Facing',
    description: 'Secondary dual-monitor display facing customers with live cart breakdown and dynamic NBC Bakong KHQR.',
    href: '/pos/customer-display',
    icon: Tv,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    badge: 'Secondary Screen',
  },
];

export const MODULES_SUITE: SystemModule[] = [
  {
    id: 'pos-management',
    title: 'POS Management',
    category: 'core',
    description: 'Unified Cashier Register, Shifts, Multi-Warehouse Stock Logistics, Inter-Warehouse Transfers & Purchase Orders.',
    href: '/pos/dashboard',
    icon: Monitor,
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    badge: 'Core Suite',
    features: [
      'Cashier Fast-Touch Terminal & Barcode Scanner',
      'Multi-Warehouse Inventory & Inter-Warehouse Transfers',
      'Till Shifts, Z-Reports & Supplier Purchase Orders',
    ],
    roleRequired: 'Cashier / Manager / Administrator',
  },
];

export interface CatalogModule {
  id: string;
  name: string;
  monogram: string;
  category: string;
  description: string;
  bgPill: string;
  icon: any;
  href: string;
  isCore?: boolean;
}

export const CATALOG_MODULES: CatalogModule[] = [
  {
    id: 'pos-management',
    name: 'POS Management',
    monogram: 'POS',
    category: 'Core Commerce & Operations',
    description: 'Unified Cashier Terminal, Till Shifts & Float Auditing, Multi-Warehouse Stock, Kitchen Display (KDS) & Customer Display (CFD).',
    bgPill: 'bg-purple-50 text-[#5B4DFB]',
    icon: Store,
    href: '/pos/dashboard',
    isCore: false,
  },
  {
    id: 'staff-hrm',
    name: 'HRM, Staff & Payroll',
    monogram: 'HR',
    category: 'Workforce Management',
    description: 'Staff headcount directory, 4-digit POS register PIN quick-switch, timesheets, and payroll.',
    bgPill: 'bg-rose-50 text-rose-600',
    icon: Users,
    href: '/hrm',
  },
  {
    id: 'crm-loyalty',
    name: 'Customer CRM & Loyalty',
    monogram: 'CR',
    category: 'Customer Growth',
    description: 'Customer contact directory, wholesale B2B contracts, VIP loyalty points, and purchase history.',
    bgPill: 'bg-blue-50 text-blue-600',
    icon: Briefcase,
    href: '/crm',
  },
  {
    id: 'financial-management',
    name: 'Financial & Accounting',
    monogram: 'FN',
    category: 'Financial Operations & Ledgers',
    description: 'General Ledger, Chart of Accounts (COA), Accounts Receivable (AR), Accounts Payable (AP), bank reconciliations, and P&L.',
    bgPill: 'bg-emerald-50 text-emerald-700',
    icon: DollarSign,
    href: '/financial',
  },
  {
    id: 'bill-subscription',
    name: 'Bill & SaaS Subscription',
    monogram: 'BS',
    category: 'Finance & Billing',
    description: 'Automate recurring customer invoices, subscription quotas, and failed payment retry webhooks.',
    bgPill: 'bg-slate-100 text-slate-900',
    icon: Zap,
    href: '/super-admin/finance/billing',
  },
  {
    id: 'telemetry-hub',
    name: 'Platform Infrastructure Hub',
    monogram: 'TM',
    category: 'Platform Operations',
    description: 'Real-time microservices latency monitoring, connection pools, RabbitMQ, and Redis cache telemetry.',
    bgPill: 'bg-indigo-50 text-indigo-700',
    icon: Activity,
    href: '/super-admin/infrastructure',
  },
];

