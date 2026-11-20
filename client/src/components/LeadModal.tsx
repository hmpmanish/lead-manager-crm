import React, { useState, useEffect } from 'react';
import { Lead, LeadSource, LeadStatus } from '../types';
import { X, AlertCircle } from 'lucide-react';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leadData: {
    name: string;
    email: string;
    phone: string | null;
    company: string;
    source: LeadSource;
    status: LeadStatus;
  }) => Promise<void>;
  initialLead?: Lead | null;
}

const SOURCES: LeadSource[] = [
  'Website',
  'Referral',
  'Cold Outreach',
  'LinkedIn',
  'Event',
  'Other',
];

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialLead,
}) => {
  const isEditing = Boolean(initialLead);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [source, setSource] = useState<LeadSource>('Website');
  const [status, setStatus] = useState<LeadStatus>('New');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (initialLead) {
      setName(initialLead.name);
      setEmail(initialLead.email);
      setPhone(initialLead.phone || '');
      setCompany(initialLead.company);
      setSource(initialLead.source);
      setStatus(initialLead.status);
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setSource('Website');
      setStatus('New');
    }
    setErrors({});
    setSubmitError(null);
  }, [initialLead, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Lead name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (name.trim().length > 100) {
      newErrors.name = 'Name cannot exceed 100 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please provide a valid RFC-compliant email address';
    }

    if (!company.trim()) {
      newErrors.company = 'Company name is required';
    } else if (company.trim().length > 100) {
      newErrors.company = 'Company name cannot exceed 100 characters';
    }

    if (phone && phone.trim().length > 50) {
      newErrors.phone = 'Phone number cannot exceed 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() ? phone.trim() : null,
        company: company.trim(),
        source,
        status,
      });
      onClose();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to save lead. Please check the inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-md border border-[#E2E8F0] shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-semibold text-[#0F172A]">
              {isEditing ? 'Edit Lead Information' : 'Add New Sales Lead'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? 'Update contact details or transition status in your pipeline'
                : 'Capture an inbound or outbound lead into your workspace'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 focus:outline-none"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {submitError && (
            <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-700 flex-shrink-0" strokeWidth={1.5} />
              <span>{submitError}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label htmlFor="lead-name" className="block text-xs font-medium text-slate-700 mb-1">
              Lead Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="lead-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className={`w-full px-3 py-2 text-sm border rounded-md bg-white text-[#0F172A] focus:outline-none ${
                errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-[#0F766E]'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="lead-email" className="block text-xs font-medium text-slate-700 mb-1">
              Business Email <span className="text-rose-500">*</span>
            </label>
            <input
              id="lead-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rahul.sharma@acmecorp.in"
              className={`w-full px-3 py-2 text-sm border rounded-md bg-white text-[#0F172A] focus:outline-none ${
                errors.email ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-[#0F766E]'
              }`}
            />
            {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone Number */}
            <div>
              <label htmlFor="lead-phone" className="block text-xs font-medium text-slate-700 mb-1">
                Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                id="lead-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className={`w-full px-3 py-2 text-sm border rounded-md bg-white text-[#0F172A] focus:outline-none ${
                  errors.phone ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-[#0F766E]'
                }`}
              />
              {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
            </div>

            {/* Company Name */}
            <div>
              <label htmlFor="lead-company" className="block text-xs font-medium text-slate-700 mb-1">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="lead-company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Acme Corp Technologies"
                className={`w-full px-3 py-2 text-sm border rounded-md bg-white text-[#0F172A] focus:outline-none ${
                  errors.company ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-[#0F766E]'
                }`}
              />
              {errors.company && <p className="text-xs text-rose-600 mt-1">{errors.company}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Lead Source */}
            <div>
              <label htmlFor="lead-source" className="block text-xs font-medium text-slate-700 mb-1">
                Acquisition Source
              </label>
              <select
                id="lead-source"
                value={source}
                onChange={(e) => setSource(e.target.value as LeadSource)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-[#0F172A] focus:border-[#0F766E] focus:outline-none"
              >
                {SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Pipeline Status */}
            <div>
              <label htmlFor="lead-status" className="block text-xs font-medium text-slate-700 mb-1">
                Pipeline Status
              </label>
              <select
                id="lead-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-[#0F172A] focus:border-[#0F766E] focus:outline-none"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-[#0F766E] hover:bg-[#115E59] rounded-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
