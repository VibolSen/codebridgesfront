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
    name: 'Finance & Bank Settlement',
    category: 'Accounting',
    description: 'Double-entry General Ledger, daily ABA/NBC Bakong reconciliation, AR invoices & AP supplier bills.',
    href: '/accounting',
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
    title: 'POS Management System',
    category: 'core',
    description: 'Unified Cashier Register, Real-Time Inventory, Shifts, Double-Entry Finance & Kitchen Orders.',
    href: '/pos',
    icon: Monitor,
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    badge: 'Core Suite',
    features: [
      'Cashier Fast-Touch Terminal & Barcodes',
      'Inventory, Shifts & Finance Ledgers',
      'Kitchen Display (KDS) & Customer Display',
    ],
    roleRequired: 'Cashier / Manager / Administrator',
  },
];
