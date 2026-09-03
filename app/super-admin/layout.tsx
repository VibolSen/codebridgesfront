'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getAuthUser, getAuthToken, logoutApi } from '@/lib/api';
import { SuperAdminSidebar } from '@/components/sidebar/SuperAdminSidebar';
import { SuperAdminHeader } from '@/components/header/SuperAdminHeader';
import { ImpersonationBanner } from '@/components/header/ImpersonationBanner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const currentUser = getAuthUser();
    const token = getAuthToken();
    if (!currentUser || !token) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    const role = currentUser.role || 'cashier';

    // Tier 1: Super Admin (Unrestricted platform owner access)
    if (role === 'super_admin') {
      setUser(currentUser);
      return;
    }

    // Block non-Super-Admins from SaaS platform client tenant management
    if (pathname.startsWith('/super-admin/tenants') || pathname.startsWith('/super-admin/platform/tenants')) {
      router.push('/super-admin/dashboard');
      return;
    }

    // Verify that non-super_admin users have an active organization before accessing administrative hubs
    const hasOrg = Boolean(
      currentUser.tenant_name ||
        currentUser.company_name ||
        currentUser.company ||
        (typeof window !== 'undefined' &&
          localStorage.getItem('active_org') &&
          localStorage.getItem('active_org') !== 'No Organization Yet! Please Create')
    );

    if (!hasOrg && !pathname.startsWith('/register-tenant')) {
      router.push('/register-tenant');
      return;
    }

    // Tier 2 & 3: Administrators, Tenant Owners, & Outlet Managers
    const adminRoles = ['super_admin', 'administrator', 'tenant_admin', 'admin', 'outlet_manager', 'user', 'owner'];
    
    // Tier 4: Dynamic Roles with specific sub-portal permissions
    const operationalRoles = ['inventory_clerk', 'accountant', 'supervisor'];

    if (adminRoles.includes(role) || hasOrg) {
      setUser(currentUser);
      return;
    }

    if (operationalRoles.includes(role)) {
      setUser(currentUser);
      return;
    }

    // Only non-staff frontline roles like cashiers without org admin permissions get routed to POS
    if (role === 'cashier') {
      router.push('/pos/terminal');
      return;
    }

    setUser(currentUser);
  }, [router, pathname]);

  const handleLogout = async () => {
    await logoutApi();
    router.push('/login');
  };

  const userRole = user?.role || 'admin';

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* Impersonation Security Alert Banner */}
      <ImpersonationBanner />

      {/* Top Header Bar */}
      <SuperAdminHeader
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        handleLogout={handleLogout}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar Navigation Component wrapped in Suspense */}
        <Suspense fallback={<aside className="h-full w-64 bg-white border-r border-slate-200" />}>
          <SuperAdminSidebar sidebarOpen={sidebarOpen} userRole={userRole} />
        </Suspense>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  );
}

