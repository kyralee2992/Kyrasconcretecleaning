import type { Lead, LeadStatus, Quote, QuoteLineItem } from '../index';

describe('shared-core type contracts', () => {
  it('accepts a well-formed Lead across every LeadStatus', () => {
    const statuses: LeadStatus[] = [
      'new',
      'quoted',
      'accepted',
      'rejected',
      'expired',
    ];

    for (const status of statuses) {
      const lead: Lead = {
        id: 'lead_1',
        address: '123 Main St, Salem, OR',
        requestedService: 'deep-cleaning',
        status,
        createdAt: '2026-04-17T00:00:00.000Z',
      };
      expect(lead.status).toBe(status);
    }
  });

  it('accepts a well-formed Quote with line items', () => {
    const lineItems: QuoteLineItem[] = [
      { description: 'Driveway deep clean', amountCents: 14900 },
      {
        description: 'Sidewalk soft wash',
        quantityDesc: '120 sq ft',
        amountCents: 5000,
      },
    ];

    const quote: Quote = {
      id: 'quote_1',
      leadId: 'lead_1',
      lineItems,
      totalCents: lineItems.reduce((sum, item) => sum + item.amountCents, 0),
      currency: 'usd',
      stripePaymentUrl: 'https://checkout.stripe.com/pay/cs_test_abc',
      createdAt: '2026-04-17T00:00:00.000Z',
    };

    expect(quote.totalCents).toBe(19900);
    expect(quote.lineItems).toHaveLength(2);
    expect(quote.currency).toBe('usd');
  });
});
