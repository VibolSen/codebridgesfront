import { apiFetch } from './client';

export async function getInventoryBalancesApi(outletId: string | number = 1, status?: string, search?: string) {
  let url = `/inventory/balances?outlet_id=${outletId}`;
  if (status) url += `&status=${status}`;
  if (search) url += `&q=${encodeURIComponent(search)}`;
  return await apiFetch(url);
}

export async function getInventoryMovementsApi(outletId?: string | number, type?: string, search?: string) {
  let url = '/inventory/movements';
  const params: string[] = [];
  if (outletId) params.push(`outlet_id=${outletId}`);
  if (type) params.push(`type=${type}`);
  if (search) params.push(`q=${encodeURIComponent(search)}`);
  if (params.length > 0) url += `?${params.join('&')}`;
  return await apiFetch(url);
}

export async function getExpiredProductsApi(outletId: string | number = 1, status?: string, search?: string) {
  let url = `/inventory/expired?outlet_id=${outletId}`;
  if (status) url += `&status=${status}`;
  if (search) url += `&q=${encodeURIComponent(search)}`;
  return await apiFetch(url);
}

export async function receiveStockApi(data: any) {
  return await apiFetch('/inventory/receive', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function adjustStockApi(data: any) {
  return await apiFetch('/inventory/adjust', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Purchase Orders & Purchases
export async function getPurchasesApi() {
  return await apiFetch('/purchases');
}

export async function getPurchaseOrdersApi() {
  return await apiFetch('/purchase-orders');
}

// Stock Transfers
export async function getTransfersApi(outletId?: number, status?: string, search?: string) {
  let url = '/inventory/transfers';
  const params: string[] = [];
  if (outletId) params.push(`outlet_id=${outletId}`);
  if (status) params.push(`status=${status}`);
  if (search) params.push(`q=${encodeURIComponent(search)}`);
  if (params.length > 0) url += `?${params.join('&')}`;
  return await apiFetch(url);
}

export async function getTransferDetailApi(id: string) {
  return await apiFetch(`/inventory/transfers/${id}`);
}

export async function createTransferApi(data: any) {
  return await apiFetch('/inventory/transfers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function receiveTransferApi(id: string) {
  return await apiFetch(`/inventory/transfers/${id}/receive`, {
    method: 'POST',
  });
}
