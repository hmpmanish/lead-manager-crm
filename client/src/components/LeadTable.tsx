import React from 'react';
import { Lead, PaginationMeta } from '../types';
import { StatusBadge } from './StatusBadge';
import { Mail, Phone, Edit2, Trash2, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

interface LeadTableProps {
  leads: Lead[];
  pagination: PaginationMeta;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
  onQuickStatusChange: (lead: Lead, newStatus: string) => void;
  onOpenAddModal: () => void;
  isLoading: boolean;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  pagination,
  onPageChange,
  onLimitChange,
  onEditLead,
  onDeleteLead,
  onQuickStatusChange,
  onOpenAddModal,
  isLoading,
}) => {
  const { page, limit, totalCount, totalPages } = pagination;
  const startIndex = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalCount);

  if (isLoading && leads.length === 0) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-md p-12 text-center shadow-sm">
        <div className="animate-pulse space-y-4 max-w-md mx-auto">
          <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto" />
          <div className="h-4 bg-slate-100 rounded w-1/2 mx-auto" />
        </div>
        <p className="text-sm text-slate-500 mt-4">Loading leads from secure database...</p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-md p-12 text-center shadow-sm">
        <div className="w-12 h-12 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
          <Inbox className="w-6 h-6" strokeWidth={1.5} />
        </div>
        <h3 className="text-base font-semibold text-[#0F172A] mb-1">No leads found</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-5">
          No records match your active search filters or status parameters. Add a new lead to start tracking your pipeline.
        </p>
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#0F766E] hover:bg-[#115E59] rounded-md transition-colors"
        >
          Add Your First Lead
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-md shadow-sm overflow-hidden flex flex-col">
      {/* Contained Horizontal Scroll Container */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th scope="col" className="py-3.5 px-4">Lead Name</th>
              <th scope="col" className="py-3.5 px-4">Contact Info</th>
              <th scope="col" className="py-3.5 px-4">Company</th>
              <th scope="col" className="py-3.5 px-4">Source</th>
              <th scope="col" className="py-3.5 px-4">Status</th>
              <th scope="col" className="py-3.5 px-4">Added</th>
              <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] text-sm text-[#0F172A]">
            {leads.map((lead) => {
              const formattedDate = new Date(lead.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-50/75 transition-colors group"
                >
                  {/* Lead Name */}
                  <td className="py-3.5 px-4 font-medium text-[#0F172A]">
                    {lead.name}
                  </td>

                  {/* Contact Info (Clickable tel: and mailto:) */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1 text-xs">
                      <a
                        href={`mailto:${lead.email}`}
                        className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#0F766E] transition-colors"
                        title={`Send email to ${lead.email}`}
                      >
                        <Mail className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" strokeWidth={1.5} />
                        <span className="truncate max-w-[180px]">{lead.email}</span>
                      </a>
                      {lead.phone ? (
                        <a
                          href={`tel:${lead.phone.replace(/\s+/g, '')}`}
                          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#0F766E] transition-colors"
                          title={`Call ${lead.phone}`}
                        >
                          <Phone className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" strokeWidth={1.5} />
                          <span>{lead.phone}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">No phone provided</span>
                      )}
                    </div>
                  </td>

                  {/* Company */}
                  <td className="py-3.5 px-4 text-slate-700">
                    {lead.company}
                  </td>

                  {/* Source */}
                  <td className="py-3.5 px-4">
                    <span className="inline-block text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {lead.source}
                    </span>
                  </td>

                  {/* Status with Quick Status Switcher */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={lead.status} />
                      <select
                        value={lead.status}
                        onChange={(e) => onQuickStatusChange(lead, e.target.value)}
                        className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-xs border border-slate-200 rounded px-1.5 py-0.5 bg-white text-slate-700 transition-opacity cursor-pointer"
                        title="Quick update status"
                        aria-label={`Change status for ${lead.name}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </div>
                  </td>

                  {/* Date Created */}
                  <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                    {formattedDate}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEditLead(lead)}
                        className="p-1.5 text-slate-500 hover:text-[#0F766E] hover:bg-teal-50 rounded transition-colors"
                        title="Edit lead details"
                        aria-label={`Edit ${lead.name}`}
                      >
                        <Edit2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => onDeleteLead(lead)}
                        className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                        title="Delete lead"
                        aria-label={`Delete ${lead.name}`}
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="bg-slate-50 border-t border-[#E2E8F0] px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <span>
            Showing <strong className="font-semibold text-slate-800">{startIndex}</strong> to{' '}
            <strong className="font-semibold text-slate-800">{endIndex}</strong> of{' '}
            <strong className="font-semibold text-slate-800">{totalCount}</strong> leads
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">|</span>
            <label htmlFor="limit-select" className="text-slate-500">Per page:</label>
            <select
              id="limit-select"
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="border border-slate-200 rounded px-1.5 py-0.5 bg-white text-slate-700 focus:outline-none"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        {/* Page Navigators */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="p-1.5 border border-slate-200 rounded bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          </button>

          <span className="px-2.5 py-1 text-slate-700 font-medium">
            Page {page} of {totalPages || 1}
          </span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-1.5 border border-slate-200 rounded bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
};
