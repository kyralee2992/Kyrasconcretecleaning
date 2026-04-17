import type { Lead, Quote } from '@kyralee/shared-core';

describe('apps/functions → @kyralee/shared-core link', () => {
  it('consumes the Lead interface from shared-core', () => {
    const lead: Lead = {
      id: 'lead_fn_1',
      address: '456 Liberty St NE, Salem, OR',
      requestedService: 'soft-washing',
      status: 'new',
      createdAt: '2026-04-17T00:00:00.000Z',
    };
    expect(lead.status).toBe('new');
  });

  it('consumes the Quote interface from shared-core', () => {
    const quote: Quote = {
      id: 'quote_fn_1',
      leadId: 'lead_fn_1',
      lineItems: [{ description: 'Soft wash siding', amountCents: 24900 }],
      totalCents: 24900,
      currency: 'usd',
      stripePaymentUrl: 'https://checkout.stripe.com/pay/cs_test_xyz',
      createdAt: '2026-04-17T00:00:00.000Z',
    };
    expect(quote.totalCents).toBe(24900);
  });
});
