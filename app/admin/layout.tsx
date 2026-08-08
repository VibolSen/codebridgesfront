'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getAuthUser, logoutApi } from '@/lib/api';
import { SuperAdminSidebar } from '@/components/sidebar/SuperAdminSidebar';
import {
  Menu,
  Search,
  Plus,
  Monitor,
  Bell,
  LogOut,
} from 'lucide-react';

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
    setUser(currentUser);
  }, [router]);

  const handleLogout = async () => {
    await logoutApi();
    router.push('/login');
  };

  const userRole = user?.role || 'admin';

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-100 text-slate-800 flex flex-col font-sans">
      
      {/* Top Header Bar */}
      <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        
        {/* Left Header Elements */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Dreams POS Brand Logo */}
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center font-bold text-white shadow-md shadow-orange-500/30">
              <span className="text-lg font-black">D</span>
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 hidden sm:inline">
              dreams<span className="text-orange-500 font-normal">POS</span>
            </span>
          </Link>

          {/* Global Search Input */}
          <div className="relative hidden md:block w-64 lg:w-80 ml-4">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search...  ⌘ K"
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          
          {/* Store Switcher */}
          <select className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none hidden sm:block">
            <option>Freshmart v</option>
            <option>Phnom Penh Main Outlet</option>
          </select>

          {/* Add New Button */}
          <button className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs shadow-sm shadow-orange-500/30 transition-all flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            Add New
          </button>

          {/* POS Terminal Quick Launcher */}
          <Link
            href="/pos"
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm shadow-indigo-600/30 transition-all flex items-center gap-1.5"
          >
            <Monitor className="w-3.5 h-3.5" />
            POS
          </Link>

          {/* Notifications Bell */}
          <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
              11
            </span>
          </button>

          {/* Admin Profile Dropdown */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'VB'}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold leading-tight text-slate-900">{user?.name || 'Vibol'}</p>
              <p className="text-[10px] text-orange-600 font-semibold capitalize">
                {user?.role ? user.role.replace('_', ' ') : 'Super Admin'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-rose-500 hover:text-rose-600 ml-1 p-1 rounded"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

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
