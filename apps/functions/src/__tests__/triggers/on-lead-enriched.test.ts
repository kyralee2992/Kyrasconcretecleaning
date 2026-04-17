import type { Lead, Quote } from '@kyralee/shared-core';

// ── mocks ────────────────────────────────────────────────────────────
const fetchRateCardMock = jest.fn();
jest.mock('../../drafting/rate-card', () => ({
  fetchRateCard: (opts: unknown) => fetchRateCardMock(opts),
}));

const createDraftQuoteApiMock = jest.fn();
jest.mock('../../drafting/anthropic-client', () => ({
  createDraftQuoteApi: (opts: unknown) => createDraftQuoteApiMock(opts),
}));

const draftQuoteMock = jest.fn();
jest.mock('../../drafting/draft-quote', () => ({
  draftQuote: (ctx: unknown) => draftQuoteMock(ctx),
}));

const quotesSet = jest.fn().mockResolvedValue(undefined);
const quotesDoc = jest.fn(() => ({ set: quotesSet }));
const collection = jest.fn(() => ({ doc: quotesDoc }));
jest.mock('firebase-admin/firestore', () => ({
  getFirestore: () => ({ collection }),
}));

jest.mock('firebase-functions/v2', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

const secretValue = jest.fn(() => 'sk-test-anthropic');
jest.mock('firebase-functions/params', () => ({
  defineSecret: () => ({ value: secretValue }),
}));

type TriggerCallback = (event: {
  data?: {
    after?: { data: () => Lead; ref: { update: jest.Mock } };
    before?: { data: () => Lead };
  };
  params: { leadId: string };
}) => Promise<void>;

let capturedCallback: TriggerCallback | null = null;

jest.mock('firebase-functions/v2/firestore', () => ({
  onDocumentUpdated: (_opts: unknown, cb: TriggerCallback) => {
    capturedCallback = cb;
    return { __mocked: true };
  },
}));

import '../../triggers/on-lead-enriched';

// ── fixtures ─────────────────────────────────────────────────────────
const now = '2026-04-17T12:00:00.000Z';

function baseLead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: 'lead_abc',
    clientName: 'Jane Doe',
    address: '123 Main St, Salem, OR',
    email: 'jane@example.com',
    requestedService: 'Deep Cleaning (Concrete)',
    status: 'enriched',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function makeEvent(before: Lead, after: Lead, leadId = 'lead_abc') {
  const update = jest.fn().mockResolvedValue(undefined);
  return {
    update,
    event: {
      data: {
        after: { data: () => after, ref: { update } },
        before: { data: () => before },
      },
      params: { leadId },
    },
  };
}

const sampleQuote: Quote = {
  id: 'quote_xyz',
  leadId: 'lead_abc',
  lineItems: [{ description: 'Concrete deep clean', amountCents: 18000 }],
  totalCents: 18000,
  currency: 'usd',
  draftSource: 'autonomous',
  draftReasoning: 'typical driveway @ $0.15/sqft',
  approvalStatus: 'draft',
  createdAt: now,
  updatedAt: now,
};

// ── tests ────────────────────────────────────────────────────────────
describe('onLeadEnriched trigger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchRateCardMock.mockResolvedValue({
      rateCard: {
        concreteRate: 0.15,
        roofRate: 0.25,
        deckRate: 0.35,
        sidingRate: 250,
        vehicleRate: 50,
        depositPercentage: 25,
        minProjectAmount: 149,
      },
      services: { raw: null },
      warnings: [],
    });
    createDraftQuoteApiMock.mockReturnValue({ callDraftQuoteTool: jest.fn() });
    draftQuoteMock.mockResolvedValue({ quote: sampleQuote, warnings: [] });
  });

  it('captured the callback', () => {
    expect(capturedCallback).not.toBeNull();
  });

  it('no-ops if the event carries no snapshots', async () => {
    await capturedCallback!({
      data: undefined,
      params: { leadId: 'lead_missing' },
    });
    expect(draftQuoteMock).not.toHaveBeenCalled();
  });

  it('no-ops if status was already enriched before AND after (not a transition)', async () => {
    const { update, event } = makeEvent(
      baseLead({ status: 'enriched' }),
      baseLead({ status: 'enriched' }),
    );
    await capturedCallback!(event);
    expect(draftQuoteMock).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
  });

  it('no-ops if the after status is not enriched', async () => {
    const { update, event } = makeEvent(
      baseLead({ status: 'new' }),
      baseLead({ status: 'drafted' }),
    );
    await capturedCallback!(event);
    expect(draftQuoteMock).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
  });

  it('no-ops (idempotent) if the lead already has a quoteId', async () => {
    const { update, event } = makeEvent(
      baseLead({ status: 'enriching' }),
      baseLead({ status: 'enriched', quoteId: 'existing_quote' }),
    );
    await capturedCallback!(event);
    expect(draftQuoteMock).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
  });

  it('runs the full enriching→enriched→drafting→drafted flow on success', async () => {
    const { update, event } = makeEvent(
      baseLead({ status: 'enriching' }),
      baseLead({ status: 'enriched' }),
    );

    await capturedCallback!(event);

    expect(update).toHaveBeenCalledTimes(2);
    const firstPatch = update.mock.calls[0]![0];
    const secondPatch = update.mock.calls[1]![0];

    expect(firstPatch.status).toBe('drafting');
    expect(secondPatch.status).toBe('drafted');
    expect(secondPatch.quoteId).toBe('quote_xyz');
    expect(secondPatch.draftedAt).toBe(now);

    expect(draftQuoteMock).toHaveBeenCalledTimes(1);
    expect(quotesSet).toHaveBeenCalledTimes(1);
    expect(quotesSet).toHaveBeenCalledWith(sampleQuote);

    expect(createDraftQuoteApiMock).toHaveBeenCalledWith({
      apiKey: 'sk-test-anthropic',
    });
  });

  it('rolls back to status=enriched with draftingError when draftQuote throws', async () => {
    draftQuoteMock.mockRejectedValueOnce(
      new Error('invariant-violation: below minProjectAmount'),
    );

    const { update, event } = makeEvent(
      baseLead({ status: 'enriching' }),
      baseLead({ status: 'enriched' }),
    );

    await capturedCallback!(event);

    expect(update).toHaveBeenCalledTimes(2);
    const secondPatch = update.mock.calls[1]![0];
    expect(secondPatch.status).toBe('enriched');
    expect(secondPatch.draftingError).toMatch(/invariant-violation/);
    // We did not create a Quote doc on failure.
    expect(quotesSet).not.toHaveBeenCalled();
  });

  it('rolls back when rate-card fetch itself throws', async () => {
    fetchRateCardMock.mockRejectedValueOnce(new Error('firestore kaboom'));

    const { update, event } = makeEvent(
      baseLead({ status: 'enriching' }),
      baseLead({ status: 'enriched' }),
    );

    await capturedCallback!(event);

    const secondPatch = update.mock.calls[1]![0];
    expect(secondPatch.status).toBe('enriched');
    expect(secondPatch.draftingError).toMatch(/firestore kaboom/);
  });
});
