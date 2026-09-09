export interface ReconciliationException {
  id: string | number;
  batch_code: string;
  merchant_reference: string;
  expected_amount: number | string;
  actual_amount: number | string;
  discrepancy_amount: number | string;
  exception_type: string;
  status: 'pending' | 'resolved' | string;
  notes?: string;
}

export interface ReconciliationSummary {
  pending_count: number;
  resolved_count: number;
  total_pending_discrepancy: number;
}
