import { getTenantModulesApi, updateTenantModulesApi } from './api/tenants';

export interface OrgItem {
  id: string | number;
  name: string;
  type: 'Company' | 'Outlet' | 'Tenant' | 'Personal';
  code?: string;
}

const STORAGE_KEY_PREFIX = 'cb_enabled_modules_';

export const DEFAULT_ENTERPRISE_MODULES: string[] = ['pos', 'pos-management'];

/**
 * Read enabled modules from local fast cache or default set.
 * By default, every organization starts with the Core POS Ecosystem enabled.
 */
export function getEnabledModulesForOrg(orgName: string): string[] {
  if (typeof window === 'undefined' || !orgName || orgName === 'No Organization Yet! Please Create') {
    return ['pos', 'pos-management'];
  }
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${orgName}`);
    if (!raw) {
      return ['pos', 'pos-management'];
    }
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : [];
    if (!list.includes('pos') && !list.includes('pos-management')) {
      return ['pos', 'pos-management', ...list];
    }
    return list;
  } catch (e) {
    console.warn('[modules] Failed to read enabled modules from cache:', e);
    return ['pos', 'pos-management'];
  }
}

/**
 * Fetch enabled modules directly from backend Cloud Database (Source of Truth)
 * and update local session cache.
 */
export async function fetchAndSyncModulesForOrg(orgName: string): Promise<string[]> {
  if (!orgName || orgName === 'No Organization Yet! Please Create') return [];
  try {
    const res = await getTenantModulesApi(orgName);
    if (res?.success && Array.isArray(res.modules)) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${orgName}`, JSON.stringify(res.modules));
        window.dispatchEvent(new CustomEvent('cb_modules_changed', { detail: { orgName, updated: res.modules } }));
      }
      return res.modules;
    }
  } catch (err) {
    console.warn('[modules] Could not sync with cloud DB, using local cache:', err);
  }
  return getEnabledModulesForOrg(orgName);
}

export function isModuleEnabledForOrg(orgName: string, moduleId: string): boolean {
  if (!orgName || orgName === 'No Organization Yet! Please Create') return false;
  const enabled = getEnabledModulesForOrg(orgName);
  return enabled.includes(moduleId);
}

/**
 * Enable module and persist immediately into Backend Cloud Database & Local Cache.
 */
export function enableModuleForOrg(orgName: string, moduleId: string): string[] {
  if (typeof window === 'undefined' || !orgName || orgName === 'No Organization Yet! Please Create') return [];
  const current = getEnabledModulesForOrg(orgName);
  if (!current.includes(moduleId)) {
    const updated = [...current, moduleId];
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${orgName}`, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('cb_modules_changed', { detail: { orgName, updated } }));

    // Persist to Cloud Database
    updateTenantModulesApi(updated, orgName).catch((err) =>
      console.warn('[modules] Failed to persist module to cloud DB:', err)
    );

    return updated;
  }
  return current;
}

/**
 * Disable module and persist immediately into Backend Cloud Database & Local Cache.
 */
export function disableModuleForOrg(orgName: string, moduleId: string): string[] {
  if (typeof window === 'undefined' || !orgName) return [];
  const current = getEnabledModulesForOrg(orgName);
  const updated = current.filter((id) => id !== moduleId);
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${orgName}`, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('cb_modules_changed', { detail: { orgName, updated } }));

  // Persist to Cloud Database
  updateTenantModulesApi(updated, orgName).catch((err) =>
    console.warn('[modules] Failed to persist module disable to cloud DB:', err)
  );

  return updated;
}

/**
 * Enable all modules and persist to Cloud Database.
 */
export function enableAllModulesForOrg(orgName: string, moduleIds: string[]): string[] {
  if (typeof window === 'undefined' || !orgName) return moduleIds;
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${orgName}`, JSON.stringify(moduleIds));
  window.dispatchEvent(new CustomEvent('cb_modules_changed', { detail: { orgName, updated: moduleIds } }));

  // Persist to Cloud Database
  updateTenantModulesApi(moduleIds, orgName).catch((err) =>
    console.warn('[modules] Failed to persist all modules to cloud DB:', err)
  );

  return moduleIds;
}

/**
 * Disable all modules and persist to Cloud Database.
 */
export function disableAllModulesForOrg(orgName: string): void {
  if (typeof window === 'undefined' || !orgName) return;
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${orgName}`, JSON.stringify([]));
  window.dispatchEvent(new CustomEvent('cb_modules_changed', { detail: { orgName, updated: [] } }));

  // Persist to Cloud Database
  updateTenantModulesApi([], orgName).catch((err) =>
    console.warn('[modules] Failed to persist empty modules to cloud DB:', err)
  );
}
