import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Lead } from '../types';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  lead: Lead | null;
  isDeleting: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  lead,
  isDeleting,
}) => {
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-md border border-[#E2E8F0] shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-[#0F172A]">
                Confirm Lead Deletion
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to permanently delete <strong className="text-slate-800">{lead.name}</strong> from <strong className="text-slate-800">{lead.company}</strong>?
              </p>
              <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600">
                This record will be permanently purged from your account database. This action cannot be undone.
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-3.5 py-2 text-sm font-medium text-white bg-rose-700 hover:bg-rose-800 rounded-md transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Lead'}
          </button>
        </div>
      </div>
    </div>
  );
};
