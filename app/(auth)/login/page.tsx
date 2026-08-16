'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loginApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  AlertTriangle,
  ShieldCheck,
  UserCheck,
  Store,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await loginApi(identifier, password);
      
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error('Login Error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (quickValue: string, quickPass: string = 'password') => {
    setIdentifier(quickValue);
    setPassword(quickPass);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 text-slate-900 p-4 font-sans selection:bg-orange-500 selection:text-white">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 shadow-2xl shadow-orange-500/5 space-y-6 relative overflow-hidden"
      >
        {/* Top Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-bold text-slate-500 hover:text-orange-600 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Onboarding Hub
          </Link>
          <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200 uppercase tracking-widest">
            SSO Auth
          </span>
        </div>

        {/* Header Branding */}
        <div className="text-center space-y-2 pt-1">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-orange-500/20 mb-1"
          >
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Store className="w-7 h-7 text-orange-500" />
            </div>
          </motion.div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Dreams Enterprise <span className="text-orange-500">Suite</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">Single Sign-On authentication for POS, Inventory, HR & Finance</p>
        </div>

        {/* Redirect Target Banner */}
        {redirectUrl && (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Sign in to access: <strong className="font-extrabold">{redirectUrl}</strong></span>
          </div>
        )}

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-start gap-2.5 overflow-hidden"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email / Phone Mode Switcher Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                loginMethod === 'email' ? 'bg-white text-orange-600 shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Mail className="w-3.5 h-3.5" /> Sign In with Email
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                loginMethod === 'phone' ? 'bg-white text-orange-600 shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Phone className="w-3.5 h-3.5" /> Sign In with Phone
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              {loginMethod === 'email' ? <Mail className="w-3.5 h-3.5 text-slate-400" /> : <Phone className="w-3.5 h-3.5 text-slate-400" />}
              {loginMethod === 'email' ? 'Email Address *' : 'Phone Number *'}
            </label>
            <input
              type={loginMethod === 'email' ? 'email' : 'tel'}
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={loginMethod === 'email' ? 'user@dreams-pos.com' : '+855 12 345 678'}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-xs font-medium"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Password
              </label>
              <span className="text-[11px] text-orange-600 font-bold hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-xs font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-md text-orange-500 focus:ring-orange-500 border-slate-300"
              />
              <span>Remember session</span>
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating SSO...
              </>
            ) : (
              'Sign In to Enterprise Platform'
            )}
          </motion.button>
        </form>

        {/* Quick Demo Login Preset Buttons (Only available during local development/testing) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-slate-400 font-semibold">Quick Role Test Presets:</p>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                Dev Only
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => handleQuickFill('vibolsen2002@gmail.com', 'Vibol@2020')}
                className="px-2 py-1.5 text-xs font-bold rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 transition-colors text-center shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
                Super Admin
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => handleQuickFill('cashier@pos.com', 'password')}
                className="px-2 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors text-center shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                Cashier
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => handleQuickFill('manager@pos.com', 'password')}
                className="px-2 py-1.5 text-xs font-bold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 transition-colors text-center shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                Manager
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => handleQuickFill('inventory@pos.com', 'password')}
                className="px-2 py-1.5 text-xs font-bold rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 transition-colors text-center shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                Inventory
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => handleQuickFill('accountant@pos.com', 'password')}
                className="px-2 py-1.5 text-xs font-bold rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200 transition-colors text-center shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-purple-500" />
                Accountant
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => handleQuickFill('radysen2002@gmail.com', 'Vibol2020')}
                className="px-2 py-1.5 text-xs font-bold rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 transition-colors text-center shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                User Test
              </motion.button>
            </div>
          </div>
        )}

        {/* Registration Links Footer */}
        <div className="pt-3 border-t border-slate-100 space-y-1.5 text-center text-xs">
          <p className="text-slate-500 font-medium">
            Don't have a staff account?{' '}
            <Link href="/register" className="font-extrabold text-orange-600 hover:underline">
              Register Account Here
            </Link>
          </p>
        </div>

      </motion.div>
    </div>
  );
}
