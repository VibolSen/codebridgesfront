'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getAuthUser, logoutApi } from '@/lib/api';
import { SuperAdminSidebar } from '@/components/sidebar/SuperAdminSidebar';
import { SuperAdminHeader } from '@/components/header/SuperAdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const currentUser = getAuthUser();
    if (!currentUser) {
      router.push('/login');
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

    // Tier 2 & 3: Administrators & Outlet Managers
    const adminRoles = ['administrator', 'tenant_admin', 'admin', 'outlet_manager'];
    
    // Tier 4: Dynamic Roles with specific sub-portal permissions
    const operationalRoles = ['inventory_clerk', 'accountant', 'supervisor'];

    if (adminRoles.includes(role)) {
      setUser(currentUser);
      return;
    }

    if (operationalRoles.includes(role)) {
      // Dynamic operational roles are allowed in their specific sub-routes
      setUser(currentUser);
      return;
    }

    // Dynamic Roles without administrative privileges (e.g. Cashier, Customer) are redirected to POS terminal
    router.push('/pos');
  }, [router, pathname]);

  const handleLogout = async () => {
    await logoutApi();
    router.push('/login');
  };

  const userRole = user?.role || 'admin';

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-100 text-slate-800 flex flex-col font-sans">
      
      {/* Top Header Bar */}
      <SuperAdminHeader
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        handleLogout={handleLogout}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar Navigation Component */}
        <SuperAdminSidebar sidebarOpen={sidebarOpen} userRole={userRole} />

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  );
}
