export interface IncomeRecord {
  id: string | number;
  income_ref: string;
  source: string;
  description: string;
  amount: number | string;
  date_received: string;
}

export interface IncomeFormData {
  source: string;
  description: string;
  amount: string;
  date_received: string;
}

export const INCOME_SOURCES = [
  'Catering & Preorders',
  'Event Deposit',
  'Recycling & Byproducts',
  'Vendor Rebates & Discounts',
  'Store Space Rental',
  'Ancillary Services',
  'Other Miscellaneous Revenue',
];
