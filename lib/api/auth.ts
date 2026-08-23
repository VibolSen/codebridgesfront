import { apiFetch, setAuthToken, setAuthUser, removeAuthToken } from './client';

export async function loginApi(email: string, password: string) {
  const res = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (res.token) {
    setAuthToken(res.token);
    setAuthUser(res.user);
  }

  return res;
}

export async function quickSwitchApi(pin_code: string, outlet_id?: string) {
  const res = await apiFetch('/auth/quick-switch', {
    method: 'POST',
    body: JSON.stringify({ pin_code, outlet_id }),
  });

  if (res.token) {
    setAuthToken(res.token);
    setAuthUser(res.user);
  }

  return res;
}

export async function registerApi(userData: { name: string; email?: string; password: string; role?: string; phone?: string }) {
  const res = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  if (res.token) {
    setAuthToken(res.token);
    setAuthUser(res.user);
  }

  return res;
}

export async function logoutApi() {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } finally {
    removeAuthToken();
  }
}

export async function getMeApi() {
  return await apiFetch('/me');
}

export async function verifyPinApi(pin_code: string) {
  return await apiFetch('/auth/verify-pin', {
    method: 'POST',
    body: JSON.stringify({ pin_code }),
  });
}

export async function getSessionsApi() {
  return await apiFetch('/auth/sessions');
}

export async function revokeSessionApi(id: string | number) {
  return await apiFetch(`/auth/sessions/${id}`, {
    method: 'DELETE',
  });
}

export async function logoutAllDevicesApi(include_current = false) {
  return await apiFetch('/auth/logout-all-devices', {
    method: 'POST',
    body: JSON.stringify({ include_current }),
  });
}

export async function toggle2faApi(enable: boolean) {
  return await apiFetch('/auth/2fa/toggle', {
    method: 'POST',
    body: JSON.stringify({ enable }),
  });
}

export async function inviteStaffApi(email: string, role: string, outlet_id?: string) {
  return await apiFetch('/users/invite', {
    method: 'POST',
    body: JSON.stringify({ email, role, outlet_id }),
  });
}

export async function verifyInviteApi(token: string) {
  return await apiFetch(`/auth/verify-invite?token=${encodeURIComponent(token)}`);
}

export async function acceptInviteApi(data: { token: string; name: string; password: string; pin_code?: string; phone?: string }) {
  const res = await apiFetch('/auth/accept-invite', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (res.token) {
    setAuthToken(res.token);
    setAuthUser(res.user);
  }

  return res;
}

export async function getQuotaUsageApi() {
  return await apiFetch('/tenants/quota-usage');
}

// Developer / Merchant API Keys
export async function getApiKeysApi() {
  return await apiFetch('/api-keys');
}

export async function createApiKeyApi(data: { name: string; permissions?: string[]; expires_in_days?: number }) {
  return await apiFetch('/api-keys', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteApiKeyApi(id: string) {
  return await apiFetch(`/api-keys/${id}`, {
    method: 'DELETE',
  });
}

export async function toggleApiKeyApi(id: string) {
  return await apiFetch(`/api-keys/${id}/toggle`, {
    method: 'PUT',
  });
}

export async function getUsersApi(role?: string, search?: string) {
  const params = new URLSearchParams();
  if (role) params.append('role', role);
  if (search) params.append('search', search);
  const query = params.toString() ? `?${params.toString()}` : '';
  return await apiFetch(`/users${query}`);
}

export async function createUserApi(data: any) {
  return await apiFetch('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateUserApi(id: number | string, data: any) {
  return await apiFetch(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function resetUserPasswordApi(id: number | string, password: string) {
  return await apiFetch(`/users/${id}/reset-password`, {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}

export async function deleteUserApi(id: number | string) {
  return await apiFetch(`/users/${id}`, {
    method: 'DELETE',
  });
}

export async function getRolesApi() {
  return await apiFetch('/roles');
}

export async function getPermissionsApi() {
  return await apiFetch('/permissions');
}

export async function createRoleApi(data: { name: string; description?: string; permission_ids?: string[]; company_id?: string }) {
  return await apiFetch('/roles', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getRoleByIdApi(id: string) {
  return await apiFetch(`/roles/${id}`);
}

export async function updateRoleApi(id: string, data: { name?: string; description?: string; permission_ids?: string[] }) {
  return await apiFetch(`/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteRoleApi(id: string) {
  return await apiFetch(`/roles/${id}`, {
    method: 'DELETE',
  });
}

export async function getRolePermissionsApi() {
  return await apiFetch('/roles/permissions');
}

export async function getRoleDetailApi(id: string) {
  return await apiFetch(`/roles/${id}`);
}

export async function getAuditLogsApi(module?: string) {
  let url = '/audit-logs';
  if (module && module !== 'all') {
    url += `?module=${encodeURIComponent(module)}`;
  }
  return await apiFetch(url);
}
