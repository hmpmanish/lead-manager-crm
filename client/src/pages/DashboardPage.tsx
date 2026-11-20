import React, { useState, useEffect, useCallback } from 'react';
import { Lead, LeadsApiResponse, StatusMetrics, PaginationMeta, LeadSource, LeadStatus, ToastNotification } from '../types';
import { apiRequest } from '../lib/api';
import { MetricCards } from '../components/MetricCards';
import { FilterBar } from '../components/FilterBar';
import { LeadTable } from '../components/LeadTable';
import { LeadModal } from '../components/LeadModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { Toast } from '../components/Toast';

export const DashboardPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [metrics, setMetrics] = useState<StatusMetrics>({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    lost: 0,
  });
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1,
  });

  // Query filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'name' | 'email' | 'company' | 'status'>('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  // Loading states
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const [confirmDeleteLead, setConfirmDeleteLead] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch leads
  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest<LeadsApiResponse>('/api/leads', {
        params: {
          search: debouncedSearch,
          status: statusFilter,
          page: pagination.page,
          limit: pagination.limit,
          sortBy,
          order,
        },
      });

      if (response.success) {
        setLeads(response.data);
        setPagination(response.pagination);
        setMetrics(response.metrics);
      }
    } catch (err: any) {
      addToast('error', err.message || 'Failed to load leads from the server.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, statusFilter, pagination.page, pagination.limit, sortBy, order]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Handlers
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleOrderToggle = () => {
    setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleOpenAddModal = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleSaveLead = async (leadData: {
    name: string;
    email: string;
    phone: string | null;
    company: string;
    source: LeadSource;
    status: LeadStatus;
  }) => {
    if (editingLead) {
      // Update existing lead
      const res = await apiRequest(`/api/leads/${editingLead.id}`, {
        method: 'PUT',
        body: JSON.stringify(leadData),
      });
      if (res.success) {
        addToast('success', `Lead "${leadData.name}" updated successfully.`);
        fetchLeads();
      }
    } else {
      // Create new lead
      const res = await apiRequest('/api/leads', {
        method: 'POST',
        body: JSON.stringify(leadData),
      });
      if (res.success) {
        addToast('success', `Lead "${leadData.name}" created successfully.`);
        fetchLeads();
      }
    }
  };

  const handleQuickStatusChange = async (lead: Lead, newStatus: string) => {
    try {
      const res = await apiRequest(`/api/leads/${lead.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.success) {
        addToast('success', `Updated status of "${lead.name}" to ${newStatus}.`);
        fetchLeads();
      }
    } catch (err: any) {
      addToast('error', err.message || 'Failed to update lead status.');
    }
  };

  const handleDeletePrompt = (lead: Lead) => {
    setConfirmDeleteLead(lead);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteLead) return;
    setIsDeleting(true);
    try {
      const res = await apiRequest(`/api/leads/${confirmDeleteLead.id}`, {
        method: 'DELETE',
      });
      if (res.success) {
        addToast('success', `Lead "${confirmDeleteLead.name}" deleted successfully.`);
        setConfirmDeleteLead(null);
        fetchLeads();
      }
    } catch (err: any) {
      addToast('error', err.message || 'Failed to delete lead.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Workspace Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
            Sales Pipeline Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your sales pipeline, track conversion stages, and communicate with prospective clients.
          </p>
        </div>
      </div>

      {/* Metric Counters Bar */}
      <MetricCards
        metrics={metrics}
        selectedStatus={statusFilter}
        onSelectStatus={handleStatusFilterChange}
      />

      {/* Search, Filter & Sort Controls */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={handleStatusFilterChange}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        order={order}
        onOrderToggle={handleOrderToggle}
        onOpenAddModal={handleOpenAddModal}
        totalFiltered={pagination.totalCount}
      />

      {/* Leads Table */}
      <LeadTable
        leads={leads}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onEditLead={handleEditLead}
        onDeleteLead={handleDeletePrompt}
        onQuickStatusChange={handleQuickStatusChange}
        onOpenAddModal={handleOpenAddModal}
        isLoading={isLoading}
      />

      {/* Add / Edit Lead Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveLead}
        initialLead={editingLead}
      />

      {/* Explicit Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={Boolean(confirmDeleteLead)}
        onClose={() => setConfirmDeleteLead(null)}
        onConfirm={handleConfirmDelete}
        lead={confirmDeleteLead}
        isDeleting={isDeleting}
      />

      {/* Toast Feedback Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
