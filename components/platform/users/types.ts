export interface CrossTenantUser {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  tenant_name?: string;
  tenant_id?: string;
  outlet_name?: string;
  is_active: boolean | number;
  last_login?: string;
  created_at: string;
}

export const getRoleBadge = (role: string) => {
  switch (role) {
    case 'super_admin':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'admin':
    case 'administrator':
    case 'owner':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'outlet_manager':
    case 'manager':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'cashier':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'inventory_clerk':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'accountant':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};
