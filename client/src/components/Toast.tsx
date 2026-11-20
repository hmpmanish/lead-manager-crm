import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastNotification } from '../types';

interface ToastProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-md w-full px-4 sm:px-0 pointer-events-none"
    >
      {toasts.map((toast) => {
        let borderAndBg = 'bg-white border-[#E2E8F0] text-[#0F172A]';
        let IconComponent = Info;
        let iconColor = 'text-teal-700';

        if (toast.type === 'success') {
          borderAndBg = 'bg-teal-50 border-teal-200 text-teal-900';
          IconComponent = CheckCircle2;
          iconColor = 'text-teal-700';
        } else if (toast.type === 'error') {
          borderAndBg = 'bg-rose-50 border-rose-200 text-rose-900';
          IconComponent = AlertCircle;
          iconColor = 'text-rose-700';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 border rounded-md shadow-sm transition-all animate-in fade-in slide-in-from-bottom-2 ${borderAndBg}`}
            role="alert"
          >
            <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} strokeWidth={1.5} />
            <div className="flex-1 text-sm font-medium leading-snug">{toast.message}</div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors focus:outline-none"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
