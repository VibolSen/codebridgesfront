export interface OrgItem {
  id: string | number;
  name: string;
  type: 'Company' | 'Outlet' | 'Tenant' | 'Personal';
  code?: string;
}

const STORAGE_KEY_PREFIX = 'cb_enabled_modules_';

export function getEnabledModulesForOrg(orgName: string): string[] {
  if (typeof window === 'undefined' || !orgName) return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${orgName}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('[modules] Failed to read enabled modules:', e);
    return [];
  }
}

export function isModuleEnabledForOrg(orgName: string, moduleId: string): boolean {
  if (!orgName) return false;
  const enabled = getEnabledModulesForOrg(orgName);
  return enabled.includes(moduleId);
}

export function enableModuleForOrg(orgName: string, moduleId: string): string[] {
  if (typeof window === 'undefined' || !orgName) return [];
  const current = getEnabledModulesForOrg(orgName);
  if (!current.includes(moduleId)) {
    const updated = [...current, moduleId];
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${orgName}`, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('cb_modules_changed', { detail: { orgName, updated } }));
    return updated;
  }
  return current;
}

export function disableModuleForOrg(orgName: string, moduleId: string): string[] {
  if (typeof window === 'undefined' || !orgName) return [];
  const current = getEnabledModulesForOrg(orgName);
  const updated = current.filter((id) => id !== moduleId);
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${orgName}`, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('cb_modules_changed', { detail: { orgName, updated } }));
  return updated;
}

export function enableAllModulesForOrg(orgName: string, moduleIds: string[]): string[] {
  if (typeof window === 'undefined' || !orgName) return [];
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${orgName}`, JSON.stringify(moduleIds));
  window.dispatchEvent(new CustomEvent('cb_modules_changed', { detail: { orgName, updated: moduleIds } }));
  return moduleIds;
}

export function disableAllModulesForOrg(orgName: string): void {
  if (typeof window === 'undefined' || !orgName) return;
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${orgName}`, JSON.stringify([]));
  window.dispatchEvent(new CustomEvent('cb_modules_changed', { detail: { orgName, updated: [] } }));
}
