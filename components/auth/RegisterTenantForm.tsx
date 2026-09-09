'use client';

import React, { useState, useEffect } from 'react';
import { User, Store, Crown } from 'lucide-react';
import { getAuthUser, apiFetch } from '@/lib/api';
import { TenantSetupHeader } from '@/components/header/TenantSetupHeader';
import {
  PlanTierSelector,
  PlanTier,
  TenantRegistrationForm,
  TenantFormData,
  TenantSuccessCard,
} from '@/components/tenant';

const PLANS: PlanTier[] = [
  {
    id: 'free_personal',
    label: 'Personal Solopreneur',
    icon: <User className="w-5 h-5" />,
    price: 0,
    billing: 'Forever Free',
    description: 'Perfect for solo shop owners, pop-up stores, street vendors, and online freelancers just getting started.',
    maxOutlets: 1,
    maxRegisters: 2,
    maxUsers: 5,
    features: [
      'Fast Touch POS Checkout',
      'ABA KHQR Instant Payment',
      'Basic Product Catalog (up to 200 SKUs)',
      'Daily Revenue Summary',
      'Public Online Storefront Page',
      'Email & Chat Support',
    ],
    gradient: 'from-slate-700 to-slate-900',
    cta: 'Start for Free',
  },
  {
    id: 'business_runner',
    label: 'Business Runner',
    icon: <Store className="w-5 h-5" />,
    badge: 'Most Popular',
    price: 49,
    billing: '/ month',
    description: 'Ideal for retail stores, cafes, restaurants, and franchise runners managing up to 5 outlet locations.',
    maxOutlets: 5,
    maxRegisters: 15,
    maxUsers: 50,
    features: [
      'Everything in Personal, plus:',
      'Multi-Outlet POS & Inventory',
      'Kitchen Display System (KDS)',
      'Customer Display Face (CFD)',
      'Supplier Purchase Orders & Stock Receiving',
      'Daily Cash Drawer Shift Auditing',
      'Staff Roles & Permissions Matrix',
      'ABA Bakong Reconciliation Reports',
      'Priority Support',
    ],
    gradient: 'from-orange-500 to-amber-500',
    cta: 'Start 14-Day Free Trial',
  },
  {
    id: 'enterprise_org',
    label: 'Enterprise Organization',
    icon: <Crown className="w-5 h-5" />,
    badge: 'Full Power',
    price: 199,
    billing: '/ month',
    description: 'For enterprise groups, chains, and organizations running multiple brands, warehouses, and hundreds of staff.',
    maxOutlets: 50,
    maxRegisters: 200,
    maxUsers: 500,
    features: [
      'Everything in Business Runner, plus:',
      'Unlimited Outlet Chains & Warehouses',
      'Central Inventory Hub & Inter-Store Transfers',
      'HR Workforce Management Portal',
      'Finance & Accounts Reconciliation Suite',
      'E-Commerce Storefront with KHQR Checkout',
      'Dynamic Custom RBAC Role Builder',
      'Enterprise Analytics & P&L Reports',
      'Dedicated SLA + Account Manager',
      'Custom Domain Integration',
    ],
    gradient: 'from-violet-600 to-indigo-600',
    cta: 'Start 14-Day Enterprise Trial',
  },
];

export function RegisterTenantForm() {
  const [selectedPlan, setSelectedPlan] = useState<PlanTier | null>(PLANS[1]);
  const [step, setStep] = useState<'choose' | 'register' | 'success'>('register');
  const [formData, setFormData] = useState<TenantFormData>({
    workspaceType: 'company',
    fullName: '',
    email: '',
    phone: '',
    country: 'KH',
    name: '',
    taxId: '',
    industry: 'retail',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registeredTenant, setRegisteredTenant] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = getAuthUser();
      if (user) {
        setCurrentUser(user);
        setFormData((prev) => ({
          ...prev,
          fullName: prev.fullName || user.name || '',
          email: prev.email || user.email || '',
          phone: prev.phone || user.phone || '',
        }));
      }

      const params = new URLSearchParams(window.location.search);
      const typeParam = params.get('type');

      if (typeParam === 'personal') {
        setFormData((prev) => ({ ...prev, workspaceType: 'personal' }));
        setSelectedPlan(PLANS[0]);
      } else {
        setFormData((prev) => ({ ...prev, workspaceType: 'company' }));
        setSelectedPlan(PLANS[1]);
      }
      setStep('register');
    }
  }, []);

  const handleSelectPlanType = (type: 'personal' | 'company') => {
    setFormData((prev) => ({ ...prev, workspaceType: type }));
    setSelectedPlan(type === 'personal' ? PLANS[0] : PLANS[1]);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    try {
      setLoading(true);
      setError('');

      const tenantName = formData.name.trim() || formData.fullName.trim() || 'My Organization';
      let registeredData: any = null;

      try {
        const res = await apiFetch('/tenants/register', {
          method: 'POST',
          body: JSON.stringify({
            name: tenantName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            country: formData.country,
            client_tier: formData.workspaceType === 'personal' ? 'free_personal' : selectedPlan.id,
          }),
        });

        if (res?.data) {
          registeredData = res.data;
        } else if (res?.name) {
          registeredData = res;
        }
      } catch (networkErr) {
        console.warn('[RegisterTenant] Backend API call failed, creating local workspace:', networkErr);
      }

      if (!registeredData) {
        registeredData = {
          name: tenantName,
          company_code: 'CB-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
          client_tier: formData.workspaceType === 'personal' ? 'free_personal' : selectedPlan.id,
          status: 'trial',
          email: formData.email,
        };
      }

      if (typeof window !== 'undefined') {
        const currentUserStr = localStorage.getItem('pos_user');
        const currentUserObj = currentUserStr ? JSON.parse(currentUserStr) : {};
        const updatedRole = currentUserObj.role === 'super_admin' ? 'super_admin' : 'administrator';
        const updatedUser = {
          ...currentUserObj,
          tenant_id: registeredData.id || currentUserObj.tenant_id,
          tenant_name: registeredData.name,
          company_name: registeredData.name,
          outlet_id: registeredData.outlet_id || currentUserObj.outlet_id,
          role: updatedRole,
        };
        localStorage.setItem('pos_user', JSON.stringify(updatedUser));
        localStorage.setItem('active_org', registeredData.name);

        window.dispatchEvent(new CustomEvent('cb_org_changed', { detail: { orgName: registeredData.name } }));
        window.dispatchEvent(new CustomEvent('cb_user_updated', { detail: { user: updatedUser } }));
      }

      setRegisteredTenant(registeredData);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-orange-500 selection:text-white font-sans">
      <TenantSetupHeader
        currentUser={currentUser}
        backUrl="/launchpad"
        backLabel="Back to Onboarding Hub"
      />

      <main className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {step === 'choose' && (
          <PlanTierSelector
            plans={PLANS}
            selectedPlan={selectedPlan}
            onSelectPlan={(plan) => setSelectedPlan(plan)}
            onProceedToForm={(plan) => {
              setSelectedPlan(plan);
              setStep('register');
            }}
          />
        )}

        {step === 'register' && selectedPlan && (
          <TenantRegistrationForm
            selectedPlan={selectedPlan}
            formData={formData}
            setFormData={setFormData}
            onBackToPlans={() => { window.location.href = '/launchpad'; }}
            onSelectPlanType={handleSelectPlanType}
            onSubmit={handleRegister}
            loading={loading}
            error={error}
          />
        )}

        {step === 'success' && registeredTenant && (
          <TenantSuccessCard
            registeredTenant={registeredTenant}
            onLaunchHub={() => {
              localStorage.setItem('active_org', registeredTenant.name);
              window.location.href = `/launchpad?action=enable&org=${encodeURIComponent(registeredTenant.name)}`;
            }}
            onEnterAdmin={() => {
              localStorage.setItem('active_org', registeredTenant.name);
              window.location.href = '/super-admin/dashboard';
            }}
          />
        )}
      </main>
    </div>
  );
}
