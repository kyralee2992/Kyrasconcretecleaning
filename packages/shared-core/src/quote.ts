export interface QuoteLineItem {
  description: string;
  quantityDesc?: string;
  amountCents: number;
}

export type QuoteDraftSource = 'autonomous' | 'manual';

export type QuoteApprovalStatus = 'draft' | 'approved' | 'rejected';

export interface Quote {
  id: string;
  leadId: string;
  lineItems: QuoteLineItem[];
  totalCents: number;
  currency: 'usd';
  stripePaymentUrl?: string;
  draftSource: QuoteDraftSource;
  approvalStatus: QuoteApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}
