import { apiFetch } from './client';

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

// Categories & Sub Categories
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

// Brands
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

// Coupons & Discounts
export async function validateCouponApi(code: string, subtotal: number) {
  return await apiFetch('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code, subtotal }),
  });
}

export async function getDiscountsApi() {
  return await apiFetch('/discounts');
}

// Restaurant Tables
export async function getTablesApi() {
  return await apiFetch('/tables');
}

export async function updateTableStatusApi(id: string, status: string) {
  return await apiFetch(`/tables/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
