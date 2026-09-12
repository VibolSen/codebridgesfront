'use client';

import React, { useState } from 'react';
import { Radio, Plus } from 'lucide-react';
import { Broadcast, SAMPLE_BROADCASTS } from './types';
import { CreateBroadcastModal } from './CreateBroadcastModal';

export function SuperAdminCommunicationsView() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(SAMPLE_BROADCASTS);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateBroadcast = (created: Broadcast) => {
    setBroadcasts((prev) => [created, ...prev]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-brand-subtle border border-brand/20 shadow-md shadow-brand/10 flex items-center justify-center">
            <Radio className="w-6 h-6 text-brand" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Global Merchant Broadcasts &amp; Announcements
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-subtle text-brand text-[10px] font-extrabold border border-brand/20 uppercase">
                Communications
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Publish in-app alerts, scheduled maintenance banners, and changelog updates to all tenant workspaces.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-brand hover:bg-brand-hover text-white font-black text-xs shadow-md shadow-brand/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Merchant Broadcast</span>
        </button>
      </div>

      {/* Broadcasts List */}
      <div className="space-y-4">
        {broadcasts.map((b) => (
          <div
            key={b.id}
            className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    b.type === 'maintenance'
                      ? 'bg-rose-100 text-rose-800'
                      : b.type === 'release_notes'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {b.type.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {b.id} • {b.publishedAt}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900">{b.title}</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{b.content}</p>

              <div className="pt-2 flex items-center gap-4 text-[11px] text-slate-400">
                <span>Target: <strong className="text-slate-700">{b.targetAudience}</strong></span>
                <span>Status: <strong className="text-emerald-600 capitalize">{b.status}</strong></span>
              </div>
            </div>

            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors shrink-0 cursor-pointer"
            >
              Edit Broadcast
            </button>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <CreateBroadcastModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBroadcast}
        broadcastCount={broadcasts.length}
      />
    </div>
  );
}
