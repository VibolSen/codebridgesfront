import {
  Zap,
  HardDrive,
  Store,
  Users,
  Monitor,
  LayoutDashboard,
  Package,
  DollarSign,
  UserCheck,
  ShieldCheck,
  Activity,
  Building2,
  Layers,
  CreditCard,
  Calendar,
  CheckCircle2,
  X,
  ArrowLeft,
  ArrowRight,
  Search,
  Power,
  Plus,
  RefreshCw,
  Download,
  Loader2,
  Bell,
  ChevronDown,
  Lock,
  LogOut,
  Compass,
} from 'lucide-react';

/**
 * CodeBridges Centralized Semantic Icon Dictionary
 * Maps domain concepts and standard user actions to consistent Lucide icons.
 */
export const AppIcons = {
  // Business Domain Modules
  Billing: Zap,
  Storage: HardDrive,
  Outlets: Store,
  Staff: Users,
  Terminal: Monitor,
  POS: LayoutDashboard,
  Inventory: Package,
  Finance: DollarSign,
  HRM: UserCheck,
  Security: ShieldCheck,
  Infrastructure: Activity,
  Organization: Building2,
  Layers: Layers,
  CreditCard: CreditCard,
  Calendar: Calendar,

  // Standard Actions & Controls
  Check: CheckCircle2,
  Close: X,
  Back: ArrowLeft,
  Forward: ArrowRight,
  Search: Search,
  Power: Power,
  Plus: Plus,
  Refresh: RefreshCw,
  Download: Download,
  Loading: Loader2,
  Bell: Bell,
  Dropdown: ChevronDown,
  Lock: Lock,
  LogOut: LogOut,
  Compass: Compass,
} as const;

export type AppIconKey = keyof typeof AppIcons;
