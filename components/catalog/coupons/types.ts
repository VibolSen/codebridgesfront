export interface CouponItem {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_spend: number;
  is_active: boolean;
  expires_at: string;
}
