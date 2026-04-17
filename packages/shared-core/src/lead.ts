import type { Enrichment } from './enrichment';

export type LeadStatus =
  | 'new'
  | 'enriching'
  | 'enriched'
  | 'drafting'
  | 'drafted'
  | 'approved'
  | 'quoted'
  | 'accepted'
  | 'rejected'
  | 'expired';

export interface Lead {
  id: string;
  clientName: string;
  address: string;
  phone?: string;
  email: string;
  requestedService: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
  status: LeadStatus;
  enrichment?: Enrichment;
  enrichmentWarnings?: string[];
  draftingError?: string;
  quoteId?: string;
  draftedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}
