/**
 * @jest-environment node
 */

type MockQuerySnap = {
  empty: boolean;
  docs: Array<{ id: string; ref: { update: jest.Mock } }>;
};

const mockGet = jest.fn<Promise<MockQuerySnap>, []>();
const mockUpdate = jest.fn<Promise<void>, [Record<string, unknown>]>();
const mockSet = jest.fn<Promise<void>, [Record<string, unknown>]>();
const mockDocRef = { id: 'newLeadId', set: mockSet };

const chain = {
  where: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  get: mockGet,
};

const mockCollection = {
  where: chain.where,
  limit: chain.limit,
  get: chain.get,
  doc: jest.fn(() => mockDocRef),
};

jest.mock('@/lib/firebase-admin', () => ({
  adminDb: () => ({
    collection: () => mockCollection,
  }),
}));

import { POST, GET } from '../../app/api/leads/route';

function postRequest(body: unknown): Request {
  return new Request('http://localhost/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    name: 'Jane Doe',
    email: 'Jane@Example.com',
    phone: '5035551234',
    address: ' 123 Main  St, Salem, OR ',
    serviceType: 'Soft Washing (Siding)',
    preferredDate: '2026-05-02',
    preferredTime: 'Morning (8am–11am)',
    message: 'Gate code 1234',
    ...overrides,
  };
}

describe('/api/leads route handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // default: no dedupe hit
    mockGet.mockResolvedValue({ empty: true, docs: [] });
    mockSet.mockResolvedValue();
    mockUpdate.mockResolvedValue();
  });

  it('rejects non-POST methods with 405', async () => {
    const res = await GET();
    expect(res.status).toBe(405);
  });

  it('returns 400 on invalid JSON body', async () => {
    const req = new Request('http://localhost/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{not json',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/invalid json/i);
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await POST(postRequest({ name: 'No Email' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/validation/i);
    expect(Array.isArray(json.issues)).toBe(true);
  });

  it('returns 400 on malformed email', async () => {
    const res = await POST(postRequest(validBody({ email: 'not-an-email' })));
    expect(res.status).toBe(400);
  });

  it('creates a new lead with normalized fields (201 + deduped:false)', async () => {
    const res = await POST(postRequest(validBody()));
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json).toEqual({ leadId: 'newLeadId', deduped: false });

    expect(mockSet).toHaveBeenCalledTimes(1);
    const written = mockSet.mock.calls[0]![0];
    expect(written.emailLower).toBe('jane@example.com');
    expect(written.addressNormalized).toBe('123 main st, salem, or');
    expect(written.status).toBe('new');
    expect(written.clientName).toBe('Jane Doe');
    expect(written.requestedService).toBe('Soft Washing (Siding)');
    expect(written.phone).toBe('5035551234');
    expect(written.preferredDate).toBe('2026-05-02');
    expect(written.message).toBe('Gate code 1234');
    expect(typeof written.createdAt).toBe('string');
    expect(typeof written.updatedAt).toBe('string');
  });

  it('omits optional fields when empty strings are posted', async () => {
    const res = await POST(
      postRequest(
        validBody({
          phone: '',
          preferredDate: '',
          preferredTime: '',
          message: '',
        }),
      ),
    );
    expect(res.status).toBe(201);
    const written = mockSet.mock.calls[0]![0];
    expect(written).not.toHaveProperty('phone');
    expect(written).not.toHaveProperty('preferredDate');
    expect(written).not.toHaveProperty('preferredTime');
    expect(written).not.toHaveProperty('message');
  });

  it('dedupes: on open lead within window, updates existing doc and returns 200 + deduped:true', async () => {
    mockGet.mockResolvedValueOnce({
      empty: false,
      docs: [{ id: 'existingLeadId', ref: { update: mockUpdate } }],
    });

    const res = await POST(postRequest(validBody({ message: 'Updated note' })));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ leadId: 'existingLeadId', deduped: true });

    expect(mockSet).not.toHaveBeenCalled();
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    const patch = mockUpdate.mock.calls[0]![0];
    expect(patch.message).toBe('Updated note');
    expect(typeof patch.updatedAt).toBe('string');
  });

  it('returns 500 when Firestore write fails', async () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockSet.mockRejectedValueOnce(new Error('firestore boom'));

    const res = await POST(postRequest(validBody()));
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toMatch(/failed to persist/i);
    expect(errSpy).toHaveBeenCalled();
    errSpy.mockRestore();
  });

  it('scopes the dedupe query correctly', async () => {
    await POST(postRequest(validBody()));

    // 4 where clauses: emailLower, addressNormalized, status in, createdAt >
    expect(chain.where).toHaveBeenCalledWith(
      'emailLower',
      '==',
      'jane@example.com',
    );
    expect(chain.where).toHaveBeenCalledWith(
      'addressNormalized',
      '==',
      '123 main st, salem, or',
    );
    expect(chain.where).toHaveBeenCalledWith('status', 'in', [
      'new',
      'enriching',
      'enriched',
      'drafted',
    ]);
    expect(chain.limit).toHaveBeenCalledWith(1);
  });
});
