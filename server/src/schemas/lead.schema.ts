import { z } from 'zod';
import { sanitizeString } from '../utils/sanitize';

export const LEAD_SOURCES = [
  'Website',
  'Referral',
  'Cold Outreach',
  'LinkedIn',
  'Event',
  'Other',
] as const;

export const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Qualified',
  'Lost',
] as const;

export const createLeadSchema = z.object({
  name: z
    .string({ required_error: 'Lead name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .transform(sanitizeString),
  email: z
    .string({ required_error: 'Lead email is required' })
    .email('Please enter a valid RFC-compliant email address')
    .max(255, 'Email cannot exceed 255 characters')
    .transform((val) => val.trim().toLowerCase()),
  phone: z
    .string()
    .max(50, 'Phone number cannot exceed 50 characters')
    .optional()
    .nullable()
    .transform((val) => (val ? sanitizeString(val) : null)),
  company: z
    .string({ required_error: 'Company name is required' })
    .min(1, 'Company name is required')
    .max(100, 'Company cannot exceed 100 characters')
    .transform(sanitizeString),
  source: z.enum(LEAD_SOURCES, {
    errorMap: () => ({ message: `Source must be one of: ${LEAD_SOURCES.join(', ')}` }),
  }),
  status: z.enum(LEAD_STATUSES, {
    errorMap: () => ({ message: `Status must be one of: ${LEAD_STATUSES.join(', ')}` }),
  }).default('New'),
});

export const updateLeadSchema = createLeadSchema.partial();

export const leadQuerySchema = z.object({
  search: z.string().optional().default(''),
  status: z.enum(['', ...LEAD_STATUSES]).optional().default(''),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name', 'email', 'company', 'status']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type LeadQueryParams = z.infer<typeof leadQuerySchema>;
