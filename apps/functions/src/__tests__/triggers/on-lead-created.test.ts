import type { Enrichment, Lead } from '@kyralee/shared-core';

// Mock the orchestrator so we can test the trigger's I/O handling in isolation.
const enrichLeadMock = jest.fn<
  Promise<{ enrichment: Enrichment; warnings: string[] }>,
  [unknown]
>();
jest.mock('../../enrichment/enrich-lead', () => ({
  enrichLead: (input: unknown) => enrichLeadMock(input),
}));

// Mock firebase-functions logger so test output stays clean.
jest.mock('firebase-functions/v2', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// Capture the callback wired to onDocumentCreated so we can invoke it directly.
type TriggerCallback = (event: {
  data?: { data: () => Lead; ref: { update: jest.Mock } };
  params: { leadId: string };
}) => Promise<void>;
let capturedCallback: TriggerCallback | null = null;

jest.mock('firebase-functions/v2/firestore', () => ({
  onDocumentCreated: (_path: string, cb: TriggerCallback) => {
    capturedCallback = cb;
    return { __mocked: true };
  },
}));

// Importing the module registers the trigger and captures the callback.
import '../../triggers/on-lead-created';

function baseLead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: 'lead_1',
    clientName: 'Jane Doe',
    address: '123 Main St, Salem, OR',
    email: 'jane@example.com',
    requestedService: 'deep-cleaning',
    status: 'new',
    createdAt: '2026-04-17T12:00:00.000Z',
    updatedAt: '2026-04-17T12:00:00.000Z',
    ...overrides,
  };
}

function makeEvent(lead: Lead, leadId = 'lead_1') {
  const update = jest.fn().mockResolvedValue(undefined);
  return {
    update,
    event: {
      data: { data: () => lead, ref: { update } },
      params: { leadId },
    },
  };
}

describe('onLeadCreated trigger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('captured the callback at module-load time', () => {
    expect(capturedCallback).not.toBeNull();
  });

  it('skips when the snapshot is missing (no update calls)', async () => {
    await capturedCallback!({
      data: undefined,
      params: { leadId: 'lead_missing' },
    });
    expect(enrichLeadMock).not.toHaveBeenCalled();
  });

  it('skips and does not re-enrich when status is already past new', async () => {
    const { update, event } = makeEvent(baseLead({ status: 'enriched' }));
    await capturedCallback!(event);
    expect(enrichLeadMock).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
  });

  it('marks status=enriched with blank-address warning when the address is empty', async () => {
    const { update, event } = makeEvent(baseLead({ address: '   ' }));
    await capturedCallback!(event);
    expect(enrichLeadMock).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledTimes(1);
    const patch = update.mock.calls[0]![0];
    expect(patch.status).toBe('enriched');
    expect(patch.enrichmentWarnings).toEqual(['blank-address']);
  });

  it('transitions new → enriching → enriched on success', async () => {
    const { update, event } = makeEvent(baseLead());
    enrichLeadMock.mockResolvedValueOnce({
      enrichment: {
        fetchedAt: '2026-04-17T12:00:00.000Z',
        geocode: {
          lat: 44.938,
          lng: -123.03,
          formattedAddress: 'x',
          source: 'nominatim',
        },
      },
      warnings: [],
    });

    await capturedCallback!(event);

    expect(enrichLeadMock).toHaveBeenCalledWith({
      address: '123 Main St, Salem, OR',
    });
    expect(update).toHaveBeenCalledTimes(2);
    const firstPatch = update.mock.calls[0]![0];
    const secondPatch = update.mock.calls[1]![0];
    expect(firstPatch.status).toBe('enriching');
    expect(secondPatch.status).toBe('enriched');
    expect(secondPatch.enrichment).toBeDefined();
    expect(secondPatch).not.toHaveProperty('enrichmentWarnings');
  });

  it('attaches enrichmentWarnings when the orchestrator returns any', async () => {
    const { update, event } = makeEvent(baseLead());
    enrichLeadMock.mockResolvedValueOnce({
      enrichment: { fetchedAt: '2026-04-17T12:00:00.000Z' },
      warnings: ['marion-parcels-no-match'],
    });

    await capturedCallback!(event);

    const secondPatch = update.mock.calls[1]![0];
    expect(secondPatch.enrichmentWarnings).toEqual(['marion-parcels-no-match']);
  });

  it('recovers to status=enriched with orchestrator-error warning when enrichLead throws', async () => {
    const { update, event } = makeEvent(baseLead());
    enrichLeadMock.mockRejectedValueOnce(new Error('kaboom'));

    await capturedCallback!(event);

    expect(update).toHaveBeenCalledTimes(2);
    const secondPatch = update.mock.calls[1]![0];
    expect(secondPatch.status).toBe('enriched');
    expect(secondPatch.enrichmentWarnings[0]).toMatch(/orchestrator-error/);
    expect(secondPatch.enrichmentWarnings[0]).toMatch(/kaboom/);
  });
});
