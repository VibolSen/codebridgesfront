import {
  Monitor,
  Boxes,
  Users,
  ChefHat,
  DollarSign,
  ShoppingBag,
  ShieldCheck,
  Building2,
} from 'lucide-react';

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
}

export const MODULES_SUITE: SystemModule[] = [
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
