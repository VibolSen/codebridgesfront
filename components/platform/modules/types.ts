import {
  Monitor,
  Boxes,
  DollarSign,
  Briefcase,
  Users,
  ShoppingBag,
  LucideIcon,
} from 'lucide-react';

export interface PlatformModule {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  status: 'GA / Stable' | 'Beta' | 'Enterprise';
  version: string;
  adoptionCount: number;
  isDefault: boolean;
}

export interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string;
  status: 'enabled_all' | 'beta_only' | 'disabled';
  betaTenantsCount: number;
  module: string;
}

export const MASTER_MODULES: PlatformModule[] = [
  {
    id: 'pos',
    name: 'Point of Sale (POS)',
    category: 'Sales & Terminal',
    description: 'Fast-touch cashier register, dual-currency split tender, shift till auditing, and KDS routing.',
    icon: Monitor,
    color: 'text-[#7C3AED]',
    bgColor: 'bg-[#F5F3FF]',
    status: 'GA / Stable',
    version: 'v2.4.0',
    adoptionCount: 124,
    isDefault: true,
  },
  {
    id: 'inventory',
    name: 'Stock & Inventory Engine',
    category: 'Supply Chain',
    description: 'Dual-layer stock ledger, multi-warehouse storage, PO procurement, and FEFO expiry tracking.',
    icon: Boxes,
    color: 'text-[#D97706]',
    bgColor: 'bg-[#FFFBEB]',
    status: 'GA / Stable',
    version: 'v2.4.0',
    adoptionCount: 116,
    isDefault: true,
  },
  {
    id: 'finance',
    name: 'Finance & Accounts',
    category: 'Financial Operations',
    description: 'Automated ABA settlement reconciliation, double-entry ledgers, expenses, and margin reports.',
    icon: DollarSign,
    color: 'text-[#059669]',
    bgColor: 'bg-[#ECFDF5]',
    status: 'GA / Stable',
    version: 'v2.3.5',
    adoptionCount: 88,
    isDefault: true,
  },
  {
    id: 'hrm',
    name: 'HR & Workforce',
    category: 'Human Capital',
    description: 'Staff employee roster, biometric timesheets, shift PIN security, and payroll export.',
    icon: Briefcase,
    color: 'text-[#E11D48]',
    bgColor: 'bg-[#FFF1F2]',
    status: 'GA / Stable',
    version: 'v2.2.0',
    adoptionCount: 64,
    isDefault: false,
  },
  {
    id: 'crm',
    name: 'CRM & Pipeline',
    category: 'Customer Growth',
    description: 'Deals pipeline Kanban, lead capture forms, customer communication history, and loyalty.',
    icon: Users,
    color: 'text-[#2563EB]',
    bgColor: 'bg-[#EFF6FF]',
    status: 'Beta',
    version: 'v2.1.0-beta',
    adoptionCount: 52,
    isDefault: false,
  },
  {
    id: 'shop',
    name: 'Public E-Commerce Storefront',
    category: 'Digital Commerce',
    description: 'Web catalog, shopper carting, delivery logistics tracking, and NBC Bakong KHQR checkout.',
    icon: ShoppingBag,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    status: 'GA / Stable',
    version: 'v2.0.0',
    adoptionCount: 38,
    isDefault: false,
  },
];

export const INITIAL_FLAGS: FeatureFlag[] = [
  {
    id: 'flag-1',
    name: 'AI Sales Forecast & Demand Prediction',
    key: 'ai_demand_forecast',
    description: 'Predicts inventory restock dates and suggests PO quantities using historical sales velocity.',
    status: 'beta_only',
    betaTenantsCount: 14,
    module: 'inventory',
  },
  {
    id: 'flag-2',
    name: 'Telegram Digital E-Receipt Dispatcher',
    key: 'telegram_ereceipts_v2',
    description: 'Sends instant web receipts to customers Telegram handle upon checkout completion.',
    status: 'enabled_all',
    betaTenantsCount: 128,
    module: 'pos',
  },
  {
    id: 'flag-3',
    name: 'Multi-Station KDS Course Firing',
    key: 'kds_course_staging',
    description: 'Staged course routing (Appetizers -> Mains -> Desserts) across kitchen display stations.',
    status: 'beta_only',
    betaTenantsCount: 8,
    module: 'pos',
  },
  {
    id: 'flag-4',
    name: 'Automatic Multi-Currency Exchange Rate Sync',
    key: 'auto_fx_rates_sync',
    description: 'Hourly NBC exchange rate sync for automated USD to KHR retail price updates.',
    status: 'enabled_all',
    betaTenantsCount: 128,
    module: 'finance',
  },
];
