import { apiFetch } from './client';

export async function getActiveShiftApi() {
  try {
    const res = await apiFetch('/shifts/active');
    if (res?.data?.shift) {
      return {
        ...res,
        data: {
          ...res.data,
          shift: {
            ...res.data.shift,
            ...(res.data.summary || {}),
          },
        },
      };
    }
    return res || { success: false, data: null };
  } catch (err: any) {
    console.warn('[Shifts API] Active shift query skipped or unauthenticated:', err?.message);
    return { success: false, data: null };
  }
}

export async function openShiftApi(data: { opening_float: number; outlet_id?: number | string; note?: string }) {
  return await apiFetch('/shifts/open', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function recordCashMovementApi(
  shiftIdOrData: any,
  maybeData?: { type: 'in' | 'out'; amount: number; reason: string }
) {
  if (typeof shiftIdOrData === 'object' && !maybeData) {
    return await apiFetch('/shifts/cash-movement', {
      method: 'POST',
      body: JSON.stringify(shiftIdOrData),
    });
  }
  return await apiFetch(`/shifts/${shiftIdOrData}/cash-movement`, {
    method: 'POST',
    body: JSON.stringify(maybeData),
  });
}

export async function closeShiftApi(
  shiftIdOrData: any,
  maybeData?: { counted_cash: number; closing_note?: string; note?: string; supervisor_pin?: string }
) {
  if (typeof shiftIdOrData === 'object' && !maybeData) {
    return await apiFetch('/shifts/close', {
      method: 'POST',
      body: JSON.stringify(shiftIdOrData),
    });
  }
  return await apiFetch(`/shifts/${shiftIdOrData}/close`, {
    method: 'POST',
    body: JSON.stringify(maybeData),
  });
}

export async function getShiftReportApi(period?: string) {
  const query = period ? `?period=${encodeURIComponent(period)}` : '';
  return await apiFetch(`/reports/shifts${query}`);
}

export async function getShiftHistoryApi() {
  return await apiFetch('/shifts/history');
}

export async function getShiftXReportApi(shiftId: string = 'active') {
  return await apiFetch(`/shifts/${shiftId}/x-report`);
}
