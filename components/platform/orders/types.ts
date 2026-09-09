export interface OnlineOrderLine {
  id: string | number;
  product_name: string;
  quantity: number | string;
  subtotal: number | string;
}

export interface OnlineOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_type: 'delivery' | 'pickup' | string;
  delivery_address?: string;
  fulfillment_status: 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled' | string;
  grand_total: number | string;
  created_at: string;
  lines?: OnlineOrderLine[];
}

export const getOrderStatusBadge = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'preparing':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'ready':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'completed':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'cancelled':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};
