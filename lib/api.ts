export function getApiUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:8080/api/v1`;
  }
  return 'http://127.0.0.1:8080/api/v1';
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('pos_token');
  }
  return null;
}

export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pos_token', token);
  }
}

export function removeAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pos_token');
    localStorage.removeItem('pos_user');
  }
}

export function setAuthUser(user: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pos_user', JSON.stringify(user));
  }
}

export function getAuthUser(): any | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('pos_user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const baseUrl = getApiUrl();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log(`[API Request] Calling: ${baseUrl}${endpoint}`, { options, headers });

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined' && !endpoint.includes('/auth/login')) {
      removeAuthToken();
      window.location.href = '/login';
    }
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

// Authentication API calls
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

// Admin Dashboard Analytics API calls
export async function getDashboardSummaryApi() {
  return await apiFetch('/admin/dashboard/summary');
}

export async function getDashboardWidgetsApi() {
  return await apiFetch('/admin/dashboard/widgets');
}

export async function getDashboardChartsApi() {
  return await apiFetch('/admin/dashboard/charts');
}

// Catalog API calls
export async function getProductsApi(
  outletId: number = 1,
  categoryId?: string,
  search?: string,
  stockStatus?: string,
  sortBy?: string,
  sortOrder?: string
) {
  let url = `/products?outlet_id=${outletId}`;
  if (categoryId) url += `&category_id=${categoryId}`;
  if (search) url += `&q=${encodeURIComponent(search)}`;
  if (stockStatus) url += `&stock_status=${stockStatus}`;
  if (sortBy) url += `&sort_by=${sortBy}`;
  if (sortOrder) url += `&sort_order=${sortOrder}`;
  return await apiFetch(url);
}

export async function getBarcodeProductApi(code: string) {
  return await apiFetch(`/barcodes/${encodeURIComponent(code)}`);
}

export async function createProductApi(data: any) {
  return await apiFetch('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function bulkCreateProductsApi(items: any[]) {
  return await apiFetch('/products/bulk', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
}

export async function updateProductApi(id: number, data: any) {
  return await apiFetch(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProductApi(id: number) {
  return await apiFetch(`/products/${id}`, {
    method: 'DELETE',
  });
}

// Shift API calls
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

export async function closeShiftApi(shiftId: number, data: { counted_cash: number; closing_note?: string }) {
  return await apiFetch(`/shifts/${shiftId}/close`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Cart Holding API calls
export async function holdCartApi(data: any) {
  return await apiFetch('/carts/hold', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getHeldCartsApi() {
  return await apiFetch('/carts/held');
}

export async function resumeHeldCartApi(id: string) {
  return await apiFetch(`/carts/held/${id}/resume`, {
    method: 'POST',
  });
}

export async function deleteHeldCartApi(id: string) {
  return await apiFetch(`/carts/held/${id}`, {
    method: 'DELETE',
  });
}

// User & Staff RBAC API calls
export async function getUsersApi(role?: string, search?: string) {
  let url = '/users';
  const params: string[] = [];
  if (role) params.push(`role=${role}`);
  if (search) params.push(`q=${encodeURIComponent(search)}`);
  if (params.length > 0) url += `?${params.join('&')}`;
  return await apiFetch(url);
}

export async function createUserApi(data: any) {
  return await apiFetch('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateUserApi(id: number, data: any) {
  return await apiFetch(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteUserApi(id: number) {
  return await apiFetch(`/users/${id}`, {
    method: 'DELETE',
  });
}

export async function getRolePermissionsApi() {
  return await apiFetch('/roles/permissions');
}

export async function resetUserPasswordApi(id: number, newPassword: string) {
  return await apiFetch(`/users/${id}/reset-password`, {
    method: 'POST',
    body: JSON.stringify({ new_password: newPassword }),
  });
}

export async function verifyPinApi(pinCode: string) {
  return await apiFetch('/auth/verify-pin', {
    method: 'POST',
    body: JSON.stringify({ pin_code: pinCode }),
  });
}

// Inventory Operations API calls
export async function getInventoryBalancesApi(outletId: number = 1, status?: string, search?: string) {
  let url = `/inventory/balances?outlet_id=${outletId}`;
  if (status) url += `&status=${status}`;
  if (search) url += `&q=${encodeURIComponent(search)}`;
  return await apiFetch(url);
}

export async function getInventoryMovementsApi(outletId?: number, type?: string, search?: string) {
  let url = '/inventory/movements';
  const params: string[] = [];
  if (outletId) params.push(`outlet_id=${outletId}`);
  if (type) params.push(`type=${type}`);
  if (search) params.push(`q=${encodeURIComponent(search)}`);
  if (params.length > 0) url += `?${params.join('&')}`;
  return await apiFetch(url);
}

export async function getExpiredProductsApi(outletId: number = 1, status?: string, search?: string) {
  let url = `/inventory/expired?outlet_id=${outletId}`;
  if (status) url += `&status=${status}`;
  if (search) url += `&q=${encodeURIComponent(search)}`;
  return await apiFetch(url);
}

// Categories & Sub Categories API calls
export async function getCategoriesApi(type?: string, search?: string) {
  let url = '/categories';
  const params: string[] = [];
  if (type) params.push(`type=${type}`);
  if (search) params.push(`q=${encodeURIComponent(search)}`);
  if (params.length > 0) url += `?${params.join('&')}`;
  return await apiFetch(url);
}

export async function createCategoryApi(data: any) {
  return await apiFetch('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCategoryApi(id: number, data: any) {
  return await apiFetch(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCategoryApi(id: number) {
  return await apiFetch(`/categories/${id}`, {
    method: 'DELETE',
  });
}

// Brands API calls
export async function getBrandsApi(search?: string) {
  let url = '/brands';
  if (search) url += `?q=${encodeURIComponent(search)}`;
  return await apiFetch(url);
}

export async function createBrandApi(data: any) {
  return await apiFetch('/brands', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateBrandApi(id: number, data: any) {
  return await apiFetch(`/brands/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteBrandApi(id: number) {
  return await apiFetch(`/brands/${id}`, {
    method: 'DELETE',
  });
}

// Customers CRM API calls
export async function getCustomersApi(search?: string) {
  let url = '/customers';
  if (search) url += `?q=${encodeURIComponent(search)}`;
  return await apiFetch(url);
}

export async function createCustomerApi(data: any) {
  return await apiFetch('/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCustomerApi(id: number, data: any) {
  return await apiFetch(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCustomerApi(id: number) {
  return await apiFetch(`/customers/${id}`, {
    method: 'DELETE',
  });
}

// Suppliers Procurement API calls
export async function getSuppliersApi(search?: string) {
  let url = '/suppliers';
  if (search) url += `?q=${encodeURIComponent(search)}`;
  return await apiFetch(url);
}

export async function createSupplierApi(data: any) {
  return await apiFetch('/suppliers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSupplierApi(id: number, data: any) {
  return await apiFetch(`/suppliers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteSupplierApi(id: number) {
  return await apiFetch(`/suppliers/${id}`, {
    method: 'DELETE',
  });
}

// Outlets / Stores API calls
export async function getOutletsApi(search?: string) {
  let url = '/outlets';
  if (search) url += `?q=${encodeURIComponent(search)}`;
  return await apiFetch(url);
}

export async function createOutletApi(data: any) {
  return await apiFetch('/outlets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateOutletApi(id: number, data: any) {
  return await apiFetch(`/outlets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteOutletApi(id: number) {
  return await apiFetch(`/outlets/${id}`, {
    method: 'DELETE',
  });
}

// HRM Departments API calls
export async function getDepartmentsApi(search?: string) {
  let url = '/departments';
  if (search) url += `?q=${encodeURIComponent(search)}`;
  return await apiFetch(url);
}

export async function createDepartmentApi(data: any) {
  return await apiFetch('/departments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateDepartmentApi(id: number, data: any) {
  return await apiFetch(`/departments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteDepartmentApi(id: number) {
  return await apiFetch(`/departments/${id}`, {
    method: 'DELETE',
  });
}

// HRM Employees API calls
export async function getEmployeesApi(departmentId?: number, search?: string) {
  let url = '/employees';
  const params: string[] = [];
  if (departmentId) params.push(`department_id=${departmentId}`);
  if (search) params.push(`q=${encodeURIComponent(search)}`);
  if (params.length > 0) url += `?${params.join('&')}`;
  return await apiFetch(url);
}

export async function createEmployeeApi(data: any) {
  return await apiFetch('/employees', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateEmployeeApi(id: number, data: any) {
  return await apiFetch(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteEmployeeApi(id: number) {
  return await apiFetch(`/employees/${id}`, {
    method: 'DELETE',
  });
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

// Stock Transfers API calls
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

// Checkout API calls
export async function createSaleApi(saleData: any) {
  return await apiFetch('/sales', {
    method: 'POST',
    body: JSON.stringify(saleData),
  });
}
