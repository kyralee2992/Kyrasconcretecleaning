import type { Lead } from '@kyralee/shared-core';
import {
  draftQuote,
  type DraftQuoteContext,
} from '../../drafting/draft-quote';
import type {
  DraftQuoteApi,
  DraftQuoteToolOutput,
} from '../../drafting/anthropic-client';
import type { RateCard, ServiceCatalog } from '../../drafting/types';

const RATE_CARD: RateCard = {
  concreteRate: 0.15,
  roofRate: 0.25,
  deckRate: 0.35,
  sidingRate: 250,
  vehicleRate: 50,
  depositPercentage: 25,
  minProjectAmount: 149,
};

const SERVICES: ServiceCatalog = { raw: null };

const FIXED_NOW = new Date('2026-04-17T12:00:00.000Z');

function baseLead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: 'lead_abc',
    clientName: 'Jane Doe',
    address: '123 Main St, Salem, OR',
    email: 'jane@example.com',
    requestedService: 'Deep Cleaning (Concrete)',
    status: 'enriched',
    createdAt: FIXED_NOW.toISOString(),
    updatedAt: FIXED_NOW.toISOString(),
    ...overrides,
  };
}

function mockApi(output: DraftQuoteToolOutput): DraftQuoteApi & {
  callDraftQuoteTool: jest.Mock;
} {
  return {
    callDraftQuoteTool: jest.fn().mockResolvedValue(output),
  };
}

function ctx(
  api: DraftQuoteApi,
  overrides: Partial<DraftQuoteContext> = {},
): DraftQuoteContext {
  return {
    lead: baseLead(),
    rateCard: RATE_CARD,
    services: SERVICES,
    api,
    now: () => FIXED_NOW,
    newQuoteId: () => 'quote_fixed',
    ...overrides,
  };
}

describe('draftQuote orchestrator', () => {
  it('produces a well-formed Quote on the happy path', async () => {
    const api = mockApi({
      lineItems: [
        {
          description: 'Concrete driveway deep clean',
          quantityDesc: '1200 sqft',
          amountCents: 18000,
        },
        { description: 'Sidewalk soft wash', amountCents: 5000 },
      ],
      totalCents: 23000,
      draftReasoning:
        'Lot ~7200 sqft minus building footprint suggests ~1200 sqft of flatwork at $0.15/sqft = $180; small sidewalk adds $50. Total $230.',
      confidenceWarnings: [],
    });

    const { quote, warnings } = await draftQuote(ctx(api));

    expect(api.callDraftQuoteTool).toHaveBeenCalledTimes(1);
    expect(quote.id).toBe('quote_fixed');
    expect(quote.leadId).toBe('lead_abc');
    expect(quote.totalCents).toBe(23000);
    expect(quote.lineItems).toHaveLength(2);
    expect(quote.draftSource).toBe('autonomous');
    expect(quote.approvalStatus).toBe('draft');
    expect(quote.currency).toBe('usd');
    expect(quote.draftReasoning).toMatch(/\$0\.15/);
    expect(quote.stripePaymentUrl).toBeUndefined();
    expect(warnings).toEqual([]);
  });

  it('passes the prompt through to the api', async () => {
    const api = mockApi({
      lineItems: [{ description: 'x', amountCents: 14900 }],
      totalCents: 14900,
      draftReasoning: 'min project',
    });
    await draftQuote(ctx(api));

    const call = api.callDraftQuoteTool.mock.calls[0]![0];
    expect(call.systemPrompt).toMatch(/Kyra Lee Cleaning/);
    expect(call.userPrompt).toMatch(/Deep Cleaning \(Concrete\)/);
  });

  it('propagates confidenceWarnings from the model into the result', async () => {
    const api = mockApi({
      lineItems: [{ description: 'x', amountCents: 14900 }],
      totalCents: 14900,
      draftReasoning: 'min project',
      confidenceWarnings: ['sizing-unknown', 'service-inferred-from-message'],
    });
    const { warnings } = await draftQuote(ctx(api));
    expect(warnings).toEqual(
      expect.arrayContaining([
        'sizing-unknown',
        'service-inferred-from-message',
      ]),
    );
  });

  it('throws when totalCents does not equal sum of line items', async () => {
    const api = mockApi({
      lineItems: [{ description: 'a', amountCents: 10000 }],
      totalCents: 20000,
      draftReasoning: 'mismatch',
    });
    await expect(draftQuote(ctx(api))).rejects.toThrow(
      /invariant-violation.*totalCents.*sum/,
    );
  });

  it('throws when totalCents is below minProjectAmount', async () => {
    const api = mockApi({
      lineItems: [{ description: 'a', amountCents: 5000 }],
      totalCents: 5000,
      draftReasoning: 'too low',
    });
    await expect(draftQuote(ctx(api))).rejects.toThrow(
      /below minProjectAmount/,
    );
  });

  it('throws when the tool output fails the zod schema (empty lineItems)', async () => {
    const api = mockApi({
      lineItems: [],
      totalCents: 0,
      draftReasoning: 'none',
    } as unknown as DraftQuoteToolOutput);
    await expect(draftQuote(ctx(api))).rejects.toThrow(
      /tool-output-schema-violation/,
    );
  });

  it('throws when totalCents is negative (zod schema reject)', async () => {
    const api = mockApi({
      lineItems: [{ description: 'x', amountCents: 14900 }],
      totalCents: -1,
      draftReasoning: 'bad',
    } as unknown as DraftQuoteToolOutput);
    await expect(draftQuote(ctx(api))).rejects.toThrow(
      /tool-output-schema-violation/,
    );
  });

  it('flags non-whole-dollar line items as warnings (non-fatal)', async () => {
    const api = mockApi({
      lineItems: [
        { description: 'siding', amountCents: 24950 },
        { description: 'rounding', amountCents: 50 },
      ],
      totalCents: 25000,
      draftReasoning: 'odd cents',
    });
    const { warnings } = await draftQuote(ctx(api));
    expect(
      warnings.find((w) => w.startsWith('line-item-not-whole-dollar')),
    ).toMatch(/siding/);
  });

  it('preserves optional quantityDesc on line items when present', async () => {
    const api = mockApi({
      lineItems: [
        {
          description: 'siding',
          quantityDesc: '2000 sqft home',
          amountCents: 25000,
        },
      ],
      totalCents: 25000,
      draftReasoning: 'single line',
    });
    const { quote } = await draftQuote(ctx(api));
    expect(quote.lineItems[0]!.quantityDesc).toBe('2000 sqft home');
  });
});
