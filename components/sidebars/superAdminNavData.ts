import {
  LayoutDashboard,
  Building2,
  Layers,
  CreditCard,
  Users,
  BarChart3,
  Activity,
  LifeBuoy,
  Megaphone,
  ShieldCheck,
  Sliders,
  Package,
  Boxes,
  Tag,
  DollarSign,
  Briefcase,
  Store,
  Key,
  Lock,
  Server,
  Gift,
  ShoppingCart,
  Receipt,
  FileSpreadsheet,
  QrCode,
  UtensilsCrossed,
  UserCheck,
  ShieldAlert,
  LucideIcon,
} from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  isExternal?: boolean;
}

export interface NavGroup {
  id: string;
  title: string;
  icon?: LucideIcon;
  items: NavItem[];
  allowedRoles?: string[];
  collapsible?: boolean;
}

export const platformNavGroups: NavGroup[] = [
  {
    id: 'platform-overview',
    title: 'Platform Overview',
    collapsible: false,
    items: [
      { name: 'Executive Dashboard', href: '/super-admin/dashboard', icon: LayoutDashboard, badge: 'Live' },
    ],
  },
  {
    id: 'organizations',
    title: 'Organizations & Tenancy',
    items: [
      { name: 'Client Tenants', href: '/super-admin/platform/tenants', icon: Building2 },
      { name: 'Modules & Feature Flags', href: '/super-admin/platform/modules', icon: Layers },
      { name: 'Platform Orders', href: '/super-admin/platform/orders', icon: ShoppingCart },
      { name: 'Cross-Tenant Users', href: '/super-admin/platform/users', icon: Users },
    ],
  },
  {
    id: 'finance-billing',
    title: 'Finance & SaaS Billing',
    items: [
      { name: 'Subscription Billing', href: '/super-admin/finance/billing', icon: CreditCard },
      { name: 'Financial Reports', href: '/super-admin/finance/reports', icon: BarChart3 },
      { name: 'Payment Reconciliation', href: '/super-admin/finance/reconciliation', icon: Receipt },
      { name: 'Operating Expenses', href: '/super-admin/finance/expenses', icon: DollarSign },
      { name: 'Store Income', href: '/super-admin/finance/income', icon: DollarSign },
      { name: 'Bank Accounts', href: '/super-admin/finance/bank-accounts', icon: Building2 },
    ],
  },
  {
    id: 'catalog',
    title: 'Catalog & Products',
    items: [
      { name: 'Products Catalog', href: '/super-admin/catalog/products', icon: Package },
      { name: 'Categories', href: '/super-admin/catalog/categories', icon: Tag },
      { name: 'Brands', href: '/super-admin/catalog/brands', icon: Tag },
      { name: 'Promotional Coupons', href: '/super-admin/catalog/coupons', icon: Tag },
      { name: 'Discounts & Offers', href: '/super-admin/catalog/discounts', icon: Tag },
      { name: 'Barcode Studio', href: '/super-admin/catalog/barcodes', icon: QrCode },
      { name: 'KHQR Codes', href: '/super-admin/catalog/qrcodes', icon: QrCode },
      { name: 'Restaurant Tables', href: '/super-admin/catalog/tables', icon: UtensilsCrossed },
    ],
  },
  {
    id: 'inventory',
    title: 'Inventory & Stock',
    items: [
      { name: 'Stock Inventory', href: '/super-admin/inventory', icon: Boxes },
      { name: 'Stock Transfers', href: '/super-admin/inventory/transfer', icon: Boxes },
      { name: 'Stocktake', href: '/super-admin/inventory/stocktake', icon: FileSpreadsheet },
      { name: 'Purchase Orders', href: '/super-admin/inventory/purchase-orders', icon: Package },
      { name: 'Stock Purchases', href: '/super-admin/inventory/purchases', icon: Package },
      { name: 'Stock Movement Ledger', href: '/super-admin/inventory/ledger', icon: Boxes },
      { name: 'Expired Products', href: '/super-admin/inventory/expired', icon: Tag },
    ],
  },
  {
    id: 'crm',
    title: 'CRM & Customers',
    items: [
      { name: 'Customers', href: '/super-admin/crm/customers', icon: Users },
      { name: 'Gift Cards', href: '/super-admin/crm/gift-cards', icon: Gift },
      { name: 'Vendors & Suppliers', href: '/super-admin/crm/suppliers', icon: Users },
    ],
  },
  {
    id: 'hrm',
    title: 'HR & Workforce',
    items: [
      { name: 'Employees', href: '/super-admin/hrm/employees', icon: Users },
      { name: 'Departments', href: '/super-admin/hrm/departments', icon: Building2 },
    ],
  },
  {
    id: 'system-infra',
    title: 'Telemetry & Infrastructure',
    items: [
      { name: 'Cross-Tenant Analytics', href: '/super-admin/analytics', icon: BarChart3 },
      { name: 'System Infrastructure', href: '/super-admin/infrastructure', icon: Server, badge: 'Live' },
    ],
  },
  {
    id: 'support-ops',
    title: 'Support & Operations',
    items: [
      { name: 'Support Desk', href: '/super-admin/support', icon: LifeBuoy },
      { name: 'Audit Trail', href: '/super-admin/security/audit-logs', icon: Lock },
      { name: 'Communications', href: '/super-admin/communications', icon: Megaphone },
    ],
  },
  {
    id: 'security-access',
    title: 'Security & Access (RBAC)',
    items: [
      { name: 'Staff & Users', href: '/super-admin/security/users', icon: ShieldCheck },
      { name: 'Roles & Permissions', href: '/super-admin/security/roles', icon: Sliders },
      { name: 'Stores & Outlets', href: '/super-admin/security/stores', icon: Store },
      { name: 'Security Settings', href: '/super-admin/security/settings', icon: ShieldAlert },
      { name: 'Admin Profile', href: '/super-admin/security/profile', icon: UserCheck },
    ],
  },
  {
    id: 'platform-settings',
    title: 'Platform Settings & API',
    items: [
      { name: 'Platform Settings', href: '/super-admin/settings', icon: Sliders },
      { name: 'API Keys', href: '/super-admin/api-keys', icon: Key },
    ],
  },
];
