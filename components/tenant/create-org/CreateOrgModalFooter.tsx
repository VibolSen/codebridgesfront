'use client';

import React from 'react';
import { Loader2, ArrowRight } from 'lucide-react';

interface CreateOrgModalFooterProps {
  loading: boolean;
  success: boolean;
  onCancel: () => void;
}

export function CreateOrgModalFooter({
  loading,
  success,
  onCancel,
}: CreateOrgModalFooterProps) {
  return (
    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading || success}
        className="px-5 py-2.5 rounded-xl bg-[#5B4DFB] hover:bg-[#4E3FE3] active:scale-98 text-white font-extrabold text-xs shadow-md shadow-[#5B4DFB]/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Creating Workspace...</span>
          </>
        ) : (
          <>
            <span>Create & Activate</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}
