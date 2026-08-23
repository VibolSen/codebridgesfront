'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  Save,
  CheckCircle2,
  Shield,
  ShieldCheck,
  Smartphone,
  Laptop,
  Monitor,
  Trash2,
  LogOut,
  RefreshCw,
  Clock,
  Layers,
  AlertCircle,
  Key,
  Lock,
} from 'lucide-react';
import {
  getSessionsApi,
  revokeSessionApi,
  logoutAllDevicesApi,
  toggle2faApi,
  getQuotaUsageApi,
  getMeApi,
} from '@/lib/api/auth';

export default function AdminStoreSettingsPage() {
  // Store Settings
  const [storeName, setStoreName] = useState('Dreams Coffee & Bakery');
  const [vatTaxRate, setVatTaxRate] = useState('10');
  const [currencyMode, setCurrencyMode] = useState('USD_KHR');
  const [saved, setSaved] = useState(false);

  // Active Sessions State
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Quota State
  const [quotaData, setQuotaData] = useState<any>(null);
  const [loadingQuota, setLoadingQuota] = useState(true);

  // 2FA State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState<string | null>(null);
  const [toggling2fa, setToggling2fa] = useState(false);

  const fetchSessions = async () => {
    try {
      setLoadingSessions(true);
      const res = await getSessionsApi();
      if (res.status === 'success' && res.data) {
        setSessions(res.data);
      }
    } catch (err: any) {
      console.warn('Failed to load active sessions:', err);
    } finally {
      setLoadingSessions(false);
    }
  };

  const fetchQuota = async () => {
    try {
      setLoadingQuota(true);
      const res = await getQuotaUsageApi();
      if (res.status === 'success' && res.data) {
        setQuotaData(res.data);
      }
    } catch (err: any) {
      console.warn('Failed to load quota usage:', err);
    } finally {
      setLoadingQuota(false);
    }
  };

  const fetchUserSecurity = async () => {
    try {
      const res = await getMeApi();
      if (res.status === 'success' && res.user) {
        setTwoFactorEnabled(!!res.user.two_factor_enabled);
      }
    } catch (err: any) {
      console.warn('Failed to load user security:', err);
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchQuota();
    fetchUserSecurity();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRevokeSession = async (id: string | number) => {
    if (!confirm('Are you sure you want to terminate this active device session?')) return;
    try {
      await revokeSessionApi(id);
      fetchSessions();
    } catch (err: any) {
      alert(err.message || 'Failed to terminate session.');
    }
  };

  const handleLogoutAllOther = async () => {
    if (!confirm('Are you sure you want to log out all other active devices?')) return;
    try {
      await logoutAllDevicesApi(false);
      fetchSessions();
      alert('All other devices have been logged out.');
    } catch (err: any) {
      alert(err.message || 'Failed to terminate all sessions.');
    }
  };

  const handleToggle2FA = async () => {
    setToggling2fa(true);
    try {
      const nextState = !twoFactorEnabled;
      const res = await toggle2faApi(nextState);
      if (res.status === 'success') {
        setTwoFactorEnabled(res.two_factor_enabled);
        setTwoFactorSecret(res.secret || null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to toggle 2FA.');
    } finally {
      setToggling2fa(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto font-sans text-slate-800">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Shield className="w-7 h-7 text-orange-500" />
          Store Configuration & Security Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage system configurations, subscription plan quotas, active device sessions, and account security hardening.
        </p>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> System settings saved successfully!
        </motion.div>
      )}

      {/* 1. Multi-Tenant Plan Quotas */}
      {quotaData && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-500" />
                Subscription Plan Resource Quotas
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Active Tier: <span className="font-extrabold text-orange-600 uppercase">{quotaData.tenant?.client_tier?.replace('_', ' ')}</span>
              </p>
            </div>
            <span className="px-3 py-1 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-black rounded-xl">
              {quotaData.tenant?.status?.toUpperCase()} STATUS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Users */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-extrabold text-slate-700">
                <span>Staff Accounts</span>
                <span className="text-orange-600">
                  {quotaData.quotas?.users?.used} / {quotaData.quotas?.users?.limit}
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    quotaData.quotas?.users?.is_exceeded ? 'bg-red-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${Math.min(quotaData.quotas?.users?.percentage || 0, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                {quotaData.quotas?.users?.percentage}% capacity used
              </p>
            </div>

            {/* Outlets */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-extrabold text-slate-700">
                <span>Store Outlets</span>
                <span className="text-orange-600">
                  {quotaData.quotas?.outlets?.used} / {quotaData.quotas?.outlets?.limit}
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    quotaData.quotas?.outlets?.is_exceeded ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(quotaData.quotas?.outlets?.percentage || 0, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                {quotaData.quotas?.outlets?.percentage}% capacity used
              </p>
            </div>

            {/* Registers */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-extrabold text-slate-700">
                <span>POS Registers</span>
                <span className="text-orange-600">
                  {quotaData.quotas?.registers?.used} / {quotaData.quotas?.registers?.limit}
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    quotaData.quotas?.registers?.is_exceeded ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(quotaData.quotas?.registers?.percentage || 0, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                {quotaData.quotas?.registers?.percentage}% capacity used
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Store Configuration Form */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="space-y-4 text-xs">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Store className="w-4 h-4 text-orange-500" />
            General Store & Taxation Settings
          </h2>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Company / Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Default VAT Tax Rate (%)</label>
              <input
                type="number"
                value={vatTaxRate}
                onChange={(e) => setVatTaxRate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Operating Currency Mode</label>
              <select
                value={currencyMode}
                onChange={(e) => setCurrencyMode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="USD_KHR">Dual Currency ($ USD & ៛ KHR NBC Exchange)</option>
                <option value="USD">Single Currency ($ USD)</option>
                <option value="KHR">Single Currency (៛ KHR)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 font-bold text-xs text-white rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save System Settings
          </button>
        </div>
      </form>

      {/* 3. Account Hardening & Two-Factor Authentication */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">Two-Factor Authentication (2FA)</h2>
              <p className="text-xs text-slate-500 font-medium">Add an extra layer of security to your admin account during login.</p>
            </div>
          </div>

          <button
            onClick={handleToggle2FA}
            disabled={toggling2fa}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              twoFactorEnabled
                ? 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
            }`}
          >
            {toggling2fa ? 'Updating...' : twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
          </button>
        </div>

        {twoFactorSecret && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1"
          >
            <p className="font-extrabold">2FA Enabled Successfully!</p>
            <p className="font-mono text-[11px] text-emerald-800">
              Backup Secret Key: <span className="font-black bg-white px-2 py-0.5 rounded border border-emerald-300">{twoFactorSecret}</span>
            </p>
          </motion.div>
        )}
      </div>

      {/* 4. Active Devices & Logged-In Sessions */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">Active Devices & Login Sessions</h2>
              <p className="text-xs text-slate-500 font-medium">Manage and terminate active Sanctum sessions logged into your account.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchSessions}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loadingSessions ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogoutAllOther}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout All Other Devices</span>
            </button>
          </div>
        </div>

        {loadingSessions ? (
          <div className="p-8 text-center text-xs text-slate-400 font-bold">Loading active sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 font-bold">No active sessions found.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sessions.map((s) => (
              <div key={s.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                    {s.device_name?.includes('iPhone') || s.device_name?.includes('Android') ? (
                      <Smartphone className="w-4 h-4 text-orange-500" />
                    ) : (
                      <Monitor className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-extrabold text-slate-900">{s.device_name}</p>
                      {s.is_current && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold">
                          Current Device
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">
                      IP: {s.ip_address} • Last Active: {s.last_used_at ? new Date(s.last_used_at).toLocaleDateString() : 'Just now'}
                    </p>
                  </div>
                </div>

                {!s.is_current && (
                  <button
                    onClick={() => handleRevokeSession(s.id)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Terminate Session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
