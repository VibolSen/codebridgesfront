'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  Plus,
  Send,
  Bell,
  Sparkles,
  Calendar,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface Broadcast {
  id: string;
  title: string;
  type: 'announcement' | 'maintenance' | 'release_notes';
  content: string;
  status: 'published' | 'scheduled' | 'draft';
  targetAudience: string;
  publishedAt: string;
}

const SAMPLE_BROADCASTS: Broadcast[] = [
  {
    id: 'BRD-01',
    title: 'New Feature: Multi-Currency USD & KHR Denomination Bill Counter',
    type: 'release_notes',
    content: 'Cashiers can now physically count USD and KHR cash drawer bills with instant blended calculation at 4,100 ៛/USD.',
    status: 'published',
    targetAudience: 'All Active Tenants',
    publishedAt: 'Today, 2:00 PM',
  },
  {
    id: 'BRD-02',
    title: 'Scheduled System Maintenance: NBC Bakong KHQR Gateway Upgrade',
    type: 'maintenance',
    content: 'Routine security patching and latency optimization on Sunday 02:00 AM - 03:00 AM GMT+7. Card and Cash payments remain fully operational.',
    status: 'scheduled',
    targetAudience: 'All Merchants',
    publishedAt: 'Upcoming Sunday',
  },
];

export default function SuperAdminCommunicationsPage() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(SAMPLE_BROADCASTS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<'announcement' | 'maintenance' | 'release_notes'>('announcement');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const created: Broadcast = {
      id: `BRD-${String(broadcasts.length + 1).padStart(2, '0')}`,
      title: newTitle,
      type: newType,
      content: newContent,
      status: 'published',
      targetAudience: 'All Active Merchants',
      publishedAt: 'Just now',
    };

    setBroadcasts([created, ...broadcasts]);
    setNewTitle('');
    setNewContent('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 p-0.5 shadow-md shadow-orange-500/15 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Radio className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Global Merchant Broadcasts &amp; Announcements
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-extrabold border border-purple-200 uppercase">
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
          className="px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-black text-xs shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all cursor-pointer"
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
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="font-black text-base text-slate-900">Create Merchant Broadcast</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Broadcast Type</label>
                <select
                  value={newType}
                  onChange={(e: any) => setNewType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="announcement">Platform Announcement</option>
                  <option value="maintenance">Scheduled Maintenance Alert</option>
                  <option value="release_notes">Product Release Notes / Changelog</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. System Update: New Cashier Shortcuts"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message Content</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Type the message that merchants will see in their dashboard..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
