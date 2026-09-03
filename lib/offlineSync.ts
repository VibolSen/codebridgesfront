'use client';

const QUEUE_KEY = 'pos_offline_sales_queue';
const SEQ_KEY = 'pos_offline_seq_counter';

export interface OfflineSale {
  offline_id: string;
  receipt_number: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  tenders: Array<{
    tender_type: string;
    amount: number;
  }>;
  created_at: string;
}

export function getOfflineQueue(): OfflineSale[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getNextOfflineReceiptNumber(): string {
  if (typeof window === 'undefined') return 'REC-OFFLINE-REG01-00001';
  try {
    const currentSeq = parseInt(localStorage.getItem(SEQ_KEY) || '0', 10) + 1;
    localStorage.setItem(SEQ_KEY, currentSeq.toString());
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const paddedSeq = String(currentSeq).padStart(5, '0');
    return `REC-OFFLINE-REG01-${dateStr}-${paddedSeq}`;
  } catch {
    return `REC-OFFLINE-REG01-${Date.now()}`;
  }
}

export function saveOfflineSale(cartOrPayload: any, maybeTenders?: any[]): OfflineSale {
  const receiptNo = getNextOfflineReceiptNumber();
  const offlineId = `OFFLINE-TX-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  let items: any[] = [];
  let tenders: any[] = [];

  if (Array.isArray(cartOrPayload)) {
    items = cartOrPayload.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }));
    tenders = maybeTenders || [{ tender_type: 'cash', amount: 0 }];
  } else if (cartOrPayload && typeof cartOrPayload === 'object') {
    items = cartOrPayload.items || [];
    tenders = cartOrPayload.tenders || [
      {
        tender_type: cartOrPayload.tender_type || 'cash',
        amount: cartOrPayload.cash_tendered || cartOrPayload.grand_total || 0,
      },
    ];
  }

  const saleData: OfflineSale = {
    offline_id: offlineId,
    receipt_number: receiptNo,
    items,
    tenders,
    created_at: new Date().toISOString(),
  };

  const queue = getOfflineQueue();
  queue.push(saleData);

  if (typeof window !== 'undefined') {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }

  return saleData;
}

export function clearOfflineQueue() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(QUEUE_KEY);
  }
}

export function removeOfflineSale(offlineId: string) {
  const queue = getOfflineQueue().filter((item) => item.offline_id !== offlineId);
  if (typeof window !== 'undefined') {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }
}
