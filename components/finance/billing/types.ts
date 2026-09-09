export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  popular?: boolean;
  maxOutlets: number;
  maxRegisters: number;
  maxStaff: number;
  modulesIncluded: string[];
  activeTenantsCount: number;
}
