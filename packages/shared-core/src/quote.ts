export interface QuoteLineItem {
  description: string;
  quantityDesc?: string;
  amountCents: number;
}

export interface Quote {
  id: string;
  leadId: string;
  lineItems: QuoteLineItem[];
  totalCents: number;
  currency: 'usd';
  stripePaymentUrl: string;
  createdAt: string;
}
