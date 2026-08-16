import { apiFetch } from './client';

export async function getActiveShiftApi() {
  return await apiFetch('/shifts/active');
}

export async function openShiftApi(data: { opening_float: number; outlet_id?: number }) {
  return await apiFetch('/shifts/open', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function recordCashMovementApi(shiftId: number, data: { type: 'in' | 'out'; amount: number; reason: string }) {
  return await apiFetch(`/shifts/${shiftId}/cash-movement`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function closeShiftApi(shiftId: number | string, data: { counted_cash: number; closing_note?: string; supervisor_pin?: string }) {
  return await apiFetch(`/shifts/${shiftId}/close`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getShiftReportApi() {
  return await apiFetch('/reports/shifts');
}
