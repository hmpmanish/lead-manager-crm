import React from 'react';
import { LeadStatus } from '../types';

interface StatusBadgeProps {
  status: LeadStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  let colorStyles = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    case 'New':
      colorStyles = 'bg-slate-100 text-slate-800 border-slate-300';
      break;
    case 'Contacted':
      colorStyles = 'bg-sky-50 text-sky-800 border-sky-200';
      break;
    case 'Qualified':
      colorStyles = 'bg-teal-50 text-teal-800 border-teal-200';
      break;
    case 'Lost':
      colorStyles = 'bg-rose-50 text-rose-800 border-rose-200';
      break;
  }

  const sizeStyles =
    size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-md uppercase tracking-wider ${colorStyles} ${sizeStyles}`}
    >
      {status}
    </span>
  );
};
