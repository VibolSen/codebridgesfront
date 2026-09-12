import {
  Monitor,
  Boxes,
  DollarSign,
  Briefcase,
  Users,
  ShoppingBag,
  UtensilsCrossed,
  Tv,
  LucideIcon,
} from 'lucide-react';

export interface TenantOption {
  id: string;
  name: string;
  client_tier: string;
  company_code: string;
  enabled_modules?: string[] | string;
}

export interface PlatformModule {
  id: string;
  name: string;
  category: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const MASTER_MODULES: PlatformModule[] = [
  {
    id: 'pos',
    name: 'Point of Sale (POS)',
    category: 'Sales & Terminal',
    icon: Monitor,
    color: 'text-brand',
    bgColor: 'bg-brand-subtle',
  },
  {
    id: 'inventory',
    name: 'Stock & Inventory',
    category: 'Supply Chain',
    icon: Boxes,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    id: 'finance',
    name: 'Finance & Accounts',
    category: 'Financial Operations',
    icon: DollarSign,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    id: 'hrm',
    name: 'HR & Workforce',
    category: 'Human Capital',
    icon: Briefcase,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
  },
  {
    id: 'crm',
    name: 'CRM & Growth',
    category: 'Customer Growth',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'kds',
    name: 'Kitchen Display (KDS)',
    category: 'Kitchen & Fulfillment',
    icon: UtensilsCrossed,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    id: 'cfd',
    name: 'Customer Display (CFD)',
    category: 'Hardware & Terminal',
    icon: Tv,
    color: 'text-sky-600',
    bgColor: 'bg-sky-50',
  },
  {
    id: 'shop',
    name: 'Online Storefront',
    category: 'Digital Commerce',
    icon: ShoppingBag,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
  },
];
