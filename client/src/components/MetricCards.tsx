import React from 'react';
import { StatusMetrics } from '../types';
import { Users, Sparkles, PhoneCall, CheckCircle, XCircle } from 'lucide-react';

interface MetricCardsProps {
  metrics: StatusMetrics;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  metrics,
  selectedStatus,
  onSelectStatus,
}) => {
  const cards: Array<{
    id: string;
    label: string;
    count: number;
    icon: React.ElementType;
    iconColor: string;
    borderActive: string;
  }> = [
    {
      id: '',
      label: 'Total Leads',
      count: metrics.total,
      icon: Users,
      iconColor: 'text-slate-600',
      borderActive: 'border-slate-800 ring-1 ring-slate-800',
    },
    {
      id: 'New',
      label: 'New',
      count: metrics.new,
      icon: Sparkles,
      iconColor: 'text-slate-500',
      borderActive: 'border-slate-700 ring-1 ring-slate-700',
    },
    {
      id: 'Contacted',
      label: 'Contacted',
      count: metrics.contacted,
      icon: PhoneCall,
      iconColor: 'text-sky-600',
      borderActive: 'border-sky-600 ring-1 ring-sky-600',
    },
    {
      id: 'Qualified',
      label: 'Qualified',
      count: metrics.qualified,
      icon: CheckCircle,
      iconColor: 'text-teal-600',
      borderActive: 'border-teal-700 ring-1 ring-teal-700',
    },
    {
      id: 'Lost',
      label: 'Lost',
      count: metrics.lost,
      icon: XCircle,
      iconColor: 'text-rose-600',
      borderActive: 'border-rose-600 ring-1 ring-rose-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = selectedStatus === card.id;

        return (
          <button
            key={card.label}
            onClick={() => onSelectStatus(card.id)}
            className={`bg-white border rounded-md p-4 text-left transition-all hover:border-slate-400 focus:outline-none ${
              isActive
                ? `${card.borderActive} shadow-sm bg-slate-50/50`
                : 'border-[#E2E8F0]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {card.label}
              </span>
              <Icon className={`w-4 h-4 ${card.iconColor}`} strokeWidth={1.5} />
            </div>
            <div className="text-2xl font-bold text-[#0F172A] tracking-tight">
              {card.count}
            </div>
          </button>
        );
      })}
    </div>
  );
};
