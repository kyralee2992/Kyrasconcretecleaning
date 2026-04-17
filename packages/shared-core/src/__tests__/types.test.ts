import type {
  Enrichment,
  Lead,
  LeadStatus,
  Quote,
  QuoteApprovalStatus,
  QuoteDraftSource,
  QuoteLineItem,
} from '../index';

const now = '2026-04-17T00:00:00.000Z';

function baseLead(status: LeadStatus): Lead {
  return {
    id: 'lead_1',
    clientName: 'Jane Doe',
    address: '123 Main St, Salem, OR',
    phone: '+15035550123',
    email: 'jane@example.com',
    requestedService: 'deep-cleaning',
    status,
    createdAt: now,
    updatedAt: now,
  };
}

describe('shared-core Lead contract', () => {
  it('accepts a well-formed Lead across every LeadStatus', () => {
    const statuses: LeadStatus[] = [
      'new',
      'enriching',
      'enriched',
      'drafted',
      'approved',
      'quoted',
      'accepted',
      'rejected',
      'expired',
    ];

    for (const status of statuses) {
      const lead = baseLead(status);
      expect(lead.status).toBe(status);
    }
  });

  it('carries enrichment when present', () => {
    const enrichment: Enrichment = {
      geocode: {
        lat: 44.9429,
        lng: -123.0351,
        formattedAddress: '123 Main St, Salem, OR 97301',
        source: 'nominatim',
      },
      parcel: {
        parcelId: '073W27BC03100',
        accountId: 'R12345',
        situs: '123 MAIN ST',
        situsCsz: 'SALEM, OR, 97301',
        lotSizeAcres: 0.1653,
        lotSizeSqFt: 7200,
        buildingAreaSqFt: 1850,
        livingAreaSqFt: 1600,
        zoningCode: 'RS',
        zoningDescription: 'Residential Single Family',
        propertyClass: 'RESIDENTIAL 1-3 UNITS',
        yearBuilt: 1978,
        source: 'marion-county-gis',
      },
      buildingFootprintSqFt: 1850,
      fetchedAt: now,
    };

    const lead: Lead = {
      ...baseLead('enriched'),
      enrichment,
    };

    expect(lead.enrichment?.parcel?.lotSizeSqFt).toBe(7200);
    expect(lead.enrichment?.parcel?.buildingAreaSqFt).toBe(1850);
    expect(lead.enrichment?.parcel?.yearBuilt).toBe(1978);
    expect(lead.enrichment?.geocode?.source).toBe('nominatim');
  });

  it('captures approval metadata for an approved lead', () => {
    const lead: Lead = {
      ...baseLead('approved'),
      quoteId: 'quote_1',
      draftedAt: now,
      approvedAt: now,
      approvedBy: 'uid_kyra',
    };

    expect(lead.approvedBy).toBe('uid_kyra');
    expect(lead.quoteId).toBe('quote_1');
  });

  it('carries optional capture fields from the website form', () => {
    const lead: Lead = {
      ...baseLead('new'),
      preferredDate: '2026-05-02',
      preferredTime: 'Morning (8am–11am)',
      message: 'Side gate code is 1234; dog in backyard.',
    };

    expect(lead.preferredDate).toBe('2026-05-02');
    expect(lead.preferredTime).toMatch(/Morning/);
    expect(lead.message).toContain('1234');
  });
});

describe('shared-core Quote contract', () => {
  it('accepts a draft autonomous Quote without a payment URL', () => {
    const lineItems: QuoteLineItem[] = [
      { description: 'Driveway deep clean', amountCents: 14900 },
      {
        description: 'Sidewalk soft wash',
        quantityDesc: '120 sq ft',
        amountCents: 5000,
      },
    ];

    const draft: Quote = {
      id: 'quote_1',
      leadId: 'lead_1',
      lineItems,
      totalCents: lineItems.reduce((sum, item) => sum + item.amountCents, 0),
      currency: 'usd',
      draftSource: 'autonomous',
      approvalStatus: 'draft',
      createdAt: now,
      updatedAt: now,
    };

    expect(draft.stripePaymentUrl).toBeUndefined();
    expect(draft.approvalStatus).toBe('draft');
    expect(draft.draftSource).toBe('autonomous');
  });

  it('accepts an approved Quote with payment URL and approval metadata', () => {
    const approved: Quote = {
      id: 'quote_2',
      leadId: 'lead_2',
      lineItems: [{ description: 'Soft wash siding', amountCents: 24900 }],
      totalCents: 24900,
      currency: 'usd',
      stripePaymentUrl: 'https://checkout.stripe.com/pay/cs_test_abc',
      draftSource: 'autonomous',
      approvalStatus: 'approved',
      approvedBy: 'uid_kyra',
      approvedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    expect(approved.stripePaymentUrl).toMatch(/^https:\/\//);
    expect(approved.approvalStatus).toBe('approved');
  });

  it('exposes QuoteDraftSource and QuoteApprovalStatus unions', () => {
    const sources: QuoteDraftSource[] = ['autonomous', 'manual'];
    const statuses: QuoteApprovalStatus[] = ['draft', 'approved', 'rejected'];
    expect(sources).toHaveLength(2);
    expect(statuses).toHaveLength(3);
  });
});
