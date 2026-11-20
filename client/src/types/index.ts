export type LeadSource =
  | 'Website'
  | 'Referral'
  | 'Cold Outreach'
  | 'LinkedIn'
  | 'Event'
  | 'Other';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string;
  source: LeadSource;
  status: LeadStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface StatusMetrics {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  lost: number;
}

export interface LeadsApiResponse {
  success: boolean;
  data: Lead[];
  pagination: PaginationMeta;
  metrics: StatusMetrics;
}

export interface LeadQueryParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'email' | 'company' | 'status';
  order?: 'asc' | 'desc';
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
