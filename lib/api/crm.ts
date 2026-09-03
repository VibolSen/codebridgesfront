import { apiFetch } from './client';

export interface Deal {
  id: string;
  tenant_id?: string;
  title: string;
  company?: string;
  customer_id?: string;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  probability: number;
  owner_name?: string;
  expected_close_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Lead {
  id: string;
  tenant_id?: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  score?: string;
  source?: string;
  status?: string;
  notes?: string;
  created_at?: string;
}

export interface CrmActivity {
  id: string;
  tenant_id?: string;
  deal_id?: string;
  customer_id?: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  title: string;
  contact?: string;
  summary: string;
  created_at?: string;
}

export interface CrmKpiData {
  pipeline_value: number;
  active_deals_count: number;
  deals_won_mtd: number;
  won_deals_count: number;
  win_rate: number;
  leads_count: number;
}

// Deals
export async function getCrmDealsApi(stage?: string, search?: string) {
  const params: string[] = [];
  if (stage && stage !== 'all') params.push(`stage=${encodeURIComponent(stage)}`);
  if (search) params.push(`q=${encodeURIComponent(search)}`);
  const query = params.length > 0 ? `?${params.join('&')}` : '';
  return await apiFetch(`/crm/deals${query}`);
}

export async function createCrmDealApi(data: {
  title: string;
  company?: string;
  value: number;
  stage?: string;
  probability?: number;
  owner_name?: string;
}) {
  return await apiFetch('/crm/deals', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCrmDealApi(id: string, data: Partial<Deal>) {
  return await apiFetch(`/crm/deals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCrmDealApi(id: string) {
  return await apiFetch(`/crm/deals/${id}`, {
    method: 'DELETE',
  });
}

// Leads
export async function getCrmLeadsApi(search?: string) {
  const query = search ? `?q=${encodeURIComponent(search)}` : '';
  return await apiFetch(`/crm/leads${query}`);
}

export async function createCrmLeadApi(data: {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  score?: string;
  source?: string;
  notes?: string;
}) {
  return await apiFetch('/crm/leads', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Activities
export async function getCrmActivitiesApi() {
  return await apiFetch('/crm/activities');
}

export async function createCrmActivityApi(data: {
  type: 'call' | 'email' | 'meeting' | 'note';
  title: string;
  contact?: string;
  summary: string;
}) {
  return await apiFetch('/crm/activities', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Live KPIs
export async function getCrmKpisApi(): Promise<{ status: string; data: CrmKpiData }> {
  return await apiFetch('/crm/kpis');
}
