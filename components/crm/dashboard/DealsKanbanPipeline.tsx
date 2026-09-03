'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Building2,
  User,
  DollarSign,
  Plus,
  MoreVertical,
  Sparkles,
  Loader2,
  X,
  CheckCircle2,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import {
  getCrmDealsApi,
  createCrmDealApi,
  updateCrmDealApi,
  deleteCrmDealApi,
  Deal,
} from '@/lib/api';

const STAGES = [
  { key: 'lead', label: 'Lead In', color: 'border-slate-300 text-slate-700 bg-slate-50' },
  { key: 'qualified', label: 'Qualified', color: 'border-blue-300 text-blue-700 bg-blue-50' },
  { key: 'proposal', label: 'Proposal Sent', color: 'border-purple-300 text-purple-700 bg-purple-50' },
  { key: 'negotiation', label: 'Negotiation', color: 'border-amber-300 text-amber-700 bg-amber-50' },
  { key: 'won', label: 'Closed Won', color: 'border-emerald-300 text-emerald-700 bg-emerald-50' },
];

export function DealsKanbanPipeline() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    value: '',
    stage: 'lead' as Deal['stage'],
    probability: 50,
    owner_name: 'Sales Rep',
  });

  const loadDeals = async () => {
    try {
      setLoading(true);
      const res = await getCrmDealsApi();
      const list = Array.isArray(res?.data) ? res.data : [];
      setDeals(list);
    } catch (err) {
      console.error('Failed to load CRM deals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await createCrmDealApi({
        title: formData.title,
        company: formData.company || undefined,
        value: parseFloat(formData.value) || 0,
        stage: formData.stage,
        probability: Number(formData.probability) || 50,
        owner_name: formData.owner_name || 'Sales Rep',
      });
      setIsModalOpen(false);
      setFormData({
        title: '',
        company: '',
        value: '',
        stage: 'lead',
        probability: 50,
        owner_name: 'Sales Rep',
      });
      setToastMessage('Opportunity deal created successfully.');
      setTimeout(() => setToastMessage(null), 3000);
      loadDeals();
    } catch (err: any) {
      alert(err?.message || 'Failed to create deal.');
    } finally {
      setSaving(false);
    }
  };

  const handleStageChange = async (dealId: string, newStage: Deal['stage']) => {
    try {
      setDeals((prev) =>
        prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d))
      );
      await updateCrmDealApi(dealId, { stage: newStage });
    } catch (err) {
      console.error('Failed to update stage:', err);
      loadDeals();
    }
  };

  const handleDeleteDeal = async (dealId: string) => {
    if (!confirm('Are you sure you want to remove this opportunity deal?')) return;
    try {
      setDeals((prev) => prev.filter((d) => d.id !== dealId));
      await deleteCrmDealApi(dealId);
    } catch (err) {
      console.error('Failed to delete deal:', err);
      loadDeals();
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4 relative">
      {toastMessage && (
        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-bold shadow-lg flex items-center gap-1.5 z-20">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900">Deals Pipeline Kanban</h3>
          <p className="text-xs text-slate-500 font-medium">Live multi-stage sales opportunities and pipeline values</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Opportunity</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
          <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
          <span>Loading deals pipeline...</span>
        </div>
      ) : (
        /* Kanban Board Columns */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 overflow-x-auto pb-2">
          {STAGES.map((stg) => {
            const stageDeals = deals.filter((d) => d.stage === stg.key);
            const totalVal = stageDeals.reduce((sum, d) => sum + (parseFloat(String(d.value)) || 0), 0);

            return (
              <div
                key={stg.key}
                className="bg-slate-50/80 rounded-2xl p-3 border border-slate-200/80 flex flex-col min-w-[210px]"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border ${stg.color}`}>
                    {stg.label} ({stageDeals.length})
                  </span>
                  <span className="text-[11px] font-black text-slate-700 font-mono">
                    ${totalVal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                </div>

                {/* Deals Cards */}
                <div className="space-y-2.5 flex-1">
                  {stageDeals.length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-[10px] font-semibold text-slate-400">
                      No deals in {stg.label.toLowerCase()}
                    </div>
                  ) : (
                    stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-2"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-extrabold text-xs text-slate-900 leading-snug">{deal.title}</h4>
                          <button
                            onClick={() => handleDeleteDeal(deal.id)}
                            className="text-slate-300 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                            title="Remove Deal"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {deal.company && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                            <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{deal.company}</span>
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-mono font-black text-purple-700">
                            ${parseFloat(String(deal.value || 0)).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {deal.probability}% prob
                          </span>
                        </div>

                        {/* Stage Mover Selector */}
                        <div className="pt-1.5 flex items-center gap-1">
                          <span className="text-[9px] text-slate-400 font-bold uppercase">Move:</span>
                          <select
                            value={deal.stage}
                            onChange={(e) => handleStageChange(deal.id, e.target.value as Deal['stage'])}
                            className="text-[10px] font-bold bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md px-1.5 py-0.5 text-slate-700 cursor-pointer focus:outline-none"
                          >
                            {STAGES.map((s) => (
                              <option key={s.key} value={s.key}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Deal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <span>New Sales Opportunity Deal</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Deal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. POS Hardware Bundle & Annual License"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Angkor Gourmet Bistro Group"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Deal Value ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="8400.00"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Win Probability (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pipeline Stage</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value as Deal['stage'] })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    {STAGES.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Owner / Rep</label>
                  <input
                    type="text"
                    value={formData.owner_name}
                    onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold shadow-sm flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Deal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
