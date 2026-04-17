import type { Lead, Quote } from '@kyralee/shared-core';

const now = '2026-04-17T00:00:00.000Z';

describe('apps/functions → @kyralee/shared-core link', () => {
  it('consumes the Lead interface from shared-core', () => {
    const lead: Lead = {
      id: 'lead_fn_1',
      clientName: 'Jane Doe',
      address: '456 Liberty St NE, Salem, OR',
      email: 'jane@example.com',
      requestedService: 'soft-washing',
      status: 'new',
      createdAt: now,
      updatedAt: now,
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
      draftSource: 'autonomous',
      approvalStatus: 'approved',
      createdAt: now,
      updatedAt: now,
    };
    expect(quote.totalCents).toBe(24900);
    expect(quote.approvalStatus).toBe('approved');
  });
});
