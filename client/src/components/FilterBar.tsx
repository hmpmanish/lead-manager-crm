import React from 'react';
import { Search, Plus, ArrowUpDown, Filter, X } from 'lucide-react';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  sortBy: string;
  onSortByChange: (sortBy: any) => void;
  order: 'asc' | 'desc';
  onOrderToggle: () => void;
  onOpenAddModal: () => void;
  totalFiltered?: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sortBy,
  onSortByChange,
  order,
  onOrderToggle,
  onOpenAddModal,
}) => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-md p-4 mb-4 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" strokeWidth={1.5} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, or company (e.g. rahul.sharma@acmecorp.in)..."
            className="w-full pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-md bg-[#F8FAFC] text-[#0F172A] placeholder-slate-400 focus:bg-white focus:border-[#0F766E] focus:outline-none transition-colors"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Filter & Sorting Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:inline" strokeWidth={1.5} />
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="px-2.5 py-2 text-sm border border-slate-200 rounded-md bg-white text-[#0F172A] focus:border-[#0F766E] focus:outline-none"
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="px-2.5 py-2 text-sm border border-slate-200 rounded-md bg-white text-[#0F172A] focus:border-[#0F766E] focus:outline-none"
            aria-label="Sort leads by"
          >
            <option value="createdAt">Date Created</option>
            <option value="name">Lead Name</option>
            <option value="company">Company</option>
            <option value="status">Status</option>
            <option value="updatedAt">Last Updated</option>
          </select>

          {/* Asc/Desc Toggle Button */}
          <button
            onClick={onOrderToggle}
            className="p-2 border border-slate-200 rounded-md text-slate-600 hover:text-[#0F172A] hover:bg-slate-50 transition-colors"
            title={`Sorting ${order === 'asc' ? 'Ascending' : 'Descending'}. Click to toggle.`}
            aria-label="Toggle sort order"
          >
            <ArrowUpDown className="w-4 h-4" strokeWidth={1.5} />
          </button>

          {/* Add Lead Primary CTA Button */}
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-[#0F766E] hover:bg-[#115E59] rounded-md transition-colors shadow-sm ml-auto sm:ml-0"
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
            <span>Add Lead</span>
          </button>
        </div>
      </div>
    </div>
  );
};
