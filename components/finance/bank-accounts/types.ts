export interface BankAccount {
  id: string | number;
  bank_name: string;
  account_name: string;
  account_number: string;
  currency?: string;
  status?: string;
}

export interface BankAccountFormData {
  bank_name: string;
  account_name: string;
  account_number: string;
  currency: string;
  status: string;
}

export const SUPPORTED_BANKS = [
  'ABA Bank (PayWay & KHQR)',
  'NBC Bakong Open API Engine',
  'ACLEDA Bank Plc',
  'Canadia Bank',
  'Sathapana Bank',
  'Wing Bank',
  'Other Commercial Bank',
];
