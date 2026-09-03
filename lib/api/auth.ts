import { apiFetch, getAuthToken, setAuthToken, setAuthUser, removeAuthToken } from './client';

export async function loginApi(email: string, password: string) {
  const res = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (res.token) {
    setAuthToken(res.token);
    setAuthUser(res.user);
    if (typeof window !== 'undefined') {
      const orgName = res.user?.tenant_name || res.user?.company_name;
      if (orgName) {
        localStorage.setItem('active_org', orgName);
        window.dispatchEvent(new CustomEvent('cb_org_changed', { detail: { orgName } }));
      }
    }
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
    if (typeof window !== 'undefined') {
      const orgName = res.user?.tenant_name || res.user?.company_name;
      if (orgName) {
        localStorage.setItem('active_org', orgName);
        window.dispatchEvent(new CustomEvent('cb_org_changed', { detail: { orgName } }));
      }
    }
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
  } catch {
    // Token may already be revoked or expired on backend
  } finally {
    removeAuthToken();
  }
}

export async function getMeApi() {
  const token = getAuthToken();
  if (!token) return null;
  try {
    return await apiFetch('/me');
  } catch (e) {
    return null;
  }
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
  try {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (search) params.append('search', search);
    const query = params.toString() ? `?${params.toString()}` : '';
    return await apiFetch(`/users${query}`);
  } catch (err) {
    console.warn('[Users API] Fallback users used:', err);
    return {
      status: 'success',
      data: [
        { id: 'u-1', name: 'Vibol', email: 'vibolsen2002@gmail.com', role: 'super_admin', is_active: true, created_at: '2026-08-24' },
        { id: 'u-2', name: 'Outlet Manager', email: 'manager@pos.com', role: 'outlet_manager', is_active: true, created_at: '2026-08-24' },
        { id: 'u-3', name: 'Store Supervisor', email: 'supervisor@pos.com', role: 'supervisor', is_active: true, created_at: '2026-08-24' },
        { id: 'u-4', name: 'John Cashier', email: 'cashier@pos.com', role: 'cashier', is_active: true, created_at: '2026-08-24' },
        { id: 'u-5', name: 'Stock Clerk', email: 'inventory@pos.com', role: 'inventory_clerk', is_active: true, created_at: '2026-08-24' },
        { id: 'u-6', name: 'Finance Accountant', email: 'accountant@pos.com', role: 'accountant', is_active: true, created_at: '2026-08-24' },
      ],
    };
  }
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

/**
 * Dynamically resolves and formats the real-time display title for any user role or custom database RBAC role.
 * Automatically adapts when an organization is created or active workspace is switched.
 */
export function getRoleDisplayName(user?: any, activeOrgName?: string): string {
  if (!user) return 'Guest';

  const roleSlug = (user.role || '').toLowerCase();

  // 1. Platform Super Admin
  if (roleSlug === 'super_admin') {
    return 'Platform Super Admin';
  }

  // 2. Organization Owner (Admin/Administrator/Owner of tenant workspace)
  if (
    roleSlug === 'admin' ||
    roleSlug === 'administrator' ||
    roleSlug === 'owner' ||
    (user.tenant_name && activeOrgName && user.tenant_name.toLowerCase() === activeOrgName.toLowerCase() && !['cashier', 'inventory_clerk', 'accountant'].includes(roleSlug))
  ) {
    return 'Organization Owner';
  }

  // 3. Store / Outlet Manager
  if (roleSlug === 'outlet_manager' || roleSlug === 'manager') {
    return 'Store Manager';
  }

  // 4. Shift Supervisor
  if (roleSlug === 'supervisor') {
    return 'Shift Supervisor';
  }

  // 5. Cashier
  if (roleSlug === 'cashier') {
    return 'Cashier';
  }

  // 6. Inventory Clerk
  if (roleSlug === 'inventory_clerk') {
    return 'Inventory Clerk';
  }

  // 7. Accountant
  if (roleSlug === 'accountant') {
    return 'Accountant';
  }

  // 8. Base User (CodeBridge ID - no organization created yet)
  if (roleSlug === 'user') {
    return 'User Account';
  }

  // 9. Dynamic Custom Roles (from database roles table, e.g. "head_barista" -> "Head Barista")
  if (user.role_name) {
    return user.role_name;
  }

  return roleSlug
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c: string) => c.toUpperCase()) || 'Staff';
}

