export interface OperatingExpense {
  id: string | number;
  expense_ref: string;
  category: string;
  description: string;
  amount: number | string;
  date_paid: string;
}

export interface ExpenseFormData {
  category: string;
  description: string;
  amount: string;
  date_paid: string;
}

export const EXPENSE_CATEGORIES = [
  'Utilities & Power',
  'Rent & Lease',
  'Store Maintenance',
  'Packaging & Disposables',
  'Marketing & Advertising',
  'Staff Welfare & Meals',
  'Logistics & Courier',
  'Miscellaneous Petty Cash',
];
