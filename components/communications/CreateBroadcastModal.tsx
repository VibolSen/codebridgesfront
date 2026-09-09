'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Broadcast } from './types';

interface CreateBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (broadcast: Broadcast) => void;
  broadcastCount: number;
}

export function CreateBroadcastModal({
  isOpen,
  onClose,
  onSubmit,
  broadcastCount,
}: CreateBroadcastModalProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<'announcement' | 'maintenance' | 'release_notes'>('announcement');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const created: Broadcast = {
      id: `BRD-${String(broadcastCount + 1).padStart(2, '0')}`,
      title: newTitle,
      type: newType,
      content: newContent,
      status: 'published',
      targetAudience: 'All Active Merchants',
      publishedAt: 'Just now',
    };

    onSubmit(created);
    setNewTitle('');
    setNewContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
        <h3 className="font-black text-base text-slate-900">Create Merchant Broadcast</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              onClick={onClose}
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
  );
}
