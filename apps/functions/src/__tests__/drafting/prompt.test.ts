import {
  DRAFT_QUOTE_TOOL,
  buildPrompt,
  buildSystemPrompt,
  buildUserPrompt,
} from '../../drafting/prompt';
import type { Lead } from '@kyralee/shared-core';
import type { RateCard, ServiceCatalog } from '../../drafting/types';

const now = '2026-04-17T12:00:00.000Z';

const RATE_CARD: RateCard = {
  concreteRate: 0.15,
  roofRate: 0.25,
  deckRate: 0.35,
  sidingRate: 250,
  vehicleRate: 50,
  depositPercentage: 25,
  minProjectAmount: 149,
};

const EMPTY_SERVICES: ServiceCatalog = { raw: null };
const SEEDED_SERVICES: ServiceCatalog = {
  raw: { services: [{ key: 'soft-wash', label: 'Soft Wash Siding' }] },
};

function baseLead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: 'lead_1',
    clientName: 'Jane Doe',
    address: '123 Main St, Salem, OR',
    email: 'jane@example.com',
    requestedService: 'Soft Washing (Siding)',
    status: 'enriched',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('DRAFT_QUOTE_TOOL schema', () => {
  it('forces a tool call with the right required fields', () => {
    expect(DRAFT_QUOTE_TOOL.name).toBe('draft_quote');
    const required = DRAFT_QUOTE_TOOL.input_schema.required;
    expect(required).toEqual(
      expect.arrayContaining(['lineItems', 'totalCents', 'draftReasoning']),
    );
  });

  it('declares confidenceWarnings as optional', () => {
    const required = DRAFT_QUOTE_TOOL.input_schema.required;
    expect(required).not.toContain('confidenceWarnings');
  });
});

describe('buildSystemPrompt', () => {
  it('embeds every rate-card dollar value verbatim so caching captures the real rubric', () => {
    const sys = buildSystemPrompt(RATE_CARD, EMPTY_SERVICES);
    expect(sys).toMatch(/\$0\.15 per sqft/);
    expect(sys).toMatch(/\$0\.25 per sqft/);
    expect(sys).toMatch(/\$0\.35 per sqft/);
    expect(sys).toMatch(/\$250 flat/);
    expect(sys).toMatch(/\$50 flat/);
    expect(sys).toMatch(/25%/);
    expect(sys).toMatch(/Minimum project: \$149/);
  });

  it('includes the service catalog when snapbid has one', () => {
    const sys = buildSystemPrompt(RATE_CARD, SEEDED_SERVICES);
    expect(sys).toMatch(/Soft Wash Siding/);
    expect(sys).toMatch(/soft-wash/);
  });

  it('falls back gracefully when no service catalog is present', () => {
    const sys = buildSystemPrompt(RATE_CARD, EMPTY_SERVICES);
    expect(sys).toMatch(/No snapbid service catalog/);
  });

  it('tells the model to always call the tool (never reply with free text)', () => {
    const sys = buildSystemPrompt(RATE_CARD, EMPTY_SERVICES);
    expect(sys).toMatch(/Always call the draft_quote tool/);
    expect(sys).toMatch(/Never reply with free text/);
  });

  it('names the four form requestedService labels exactly as the form emits them', () => {
    const sys = buildSystemPrompt(RATE_CARD, EMPTY_SERVICES);
    expect(sys).toContain('"Soft Washing (Siding)"');
    expect(sys).toContain('"Deep Cleaning (Concrete)"');
    expect(sys).toContain('"Both Services"');
    expect(sys).toContain('"Not Sure Yet"');
  });
});

describe('buildUserPrompt', () => {
  it('serializes lead + enrichment + warnings as inline JSON', () => {
    const lead = baseLead({
      enrichment: {
        fetchedAt: now,
        geocode: {
          lat: 44.938,
          lng: -123.03,
          formattedAddress: '123 Main St, Salem, OR 97301',
          source: 'nominatim',
        },
      },
      enrichmentWarnings: ['marion-parcels-no-match'],
    });

    const user = buildUserPrompt(lead);
    expect(user).toMatch(/draft_quote tool|tool; no free text/i);
    expect(user).toContain('```json');
    expect(user).toContain('"requestedService": "Soft Washing (Siding)"');
    expect(user).toContain('"marion-parcels-no-match"');
    expect(user).toContain('"nominatim"');
  });

  it('nulls out optional capture fields instead of omitting them', () => {
    const user = buildUserPrompt(baseLead());
    expect(user).toContain('"message": null');
    expect(user).toContain('"preferredDate": null');
  });
});

describe('buildPrompt (aggregate)', () => {
  it('produces both halves', () => {
    const { systemPrompt, userPrompt } = buildPrompt({
      lead: baseLead(),
      rateCard: RATE_CARD,
      services: EMPTY_SERVICES,
    });
    expect(systemPrompt.length).toBeGreaterThan(400);
    expect(userPrompt.length).toBeGreaterThan(50);
  });
});
