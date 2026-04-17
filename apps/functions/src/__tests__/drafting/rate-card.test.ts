import { fetchRateCard } from '../../drafting/rate-card';
import { DEFAULT_RATE_CARD } from '../../drafting/types';

interface MockDocSnap {
  exists: boolean;
  data: () => Record<string, unknown>;
}

function makeDb(
  userConfigsResult: MockDocSnap | Error,
  servicesResult: MockDocSnap | Error,
) {
  const get = (path: string) => {
    const result = path === 'settings/user_configs' ? userConfigsResult : servicesResult;
    if (result instanceof Error) return Promise.reject(result);
    return Promise.resolve(result);
  };
  return {
    doc: (path: string) => ({ get: () => get(path) }),
  } as unknown as import('firebase-admin/firestore').Firestore;
}

const FULL_CONFIG: MockDocSnap = {
  exists: true,
  data: () => ({
    concreteRate: 0.2,
    roofRate: 0.3,
    deckRate: 0.4,
    sidingRate: 275,
    vehicleRate: 60,
    depositPercentage: 30,
    minProjectAmount: 175,
  }),
};

const FULL_SERVICES: MockDocSnap = {
  exists: true,
  data: () => ({
    services: [
      { key: 'soft-wash-siding', label: 'Soft Wash (Siding)' },
      { key: 'concrete-deep-clean', label: 'Deep Clean (Concrete)' },
    ],
  }),
};

describe('fetchRateCard', () => {
  it('returns every snapbid value verbatim when both docs are present', async () => {
    const db = makeDb(FULL_CONFIG, FULL_SERVICES);
    const result = await fetchRateCard({ db });
    expect(result.rateCard).toEqual({
      concreteRate: 0.2,
      roofRate: 0.3,
      deckRate: 0.4,
      sidingRate: 275,
      vehicleRate: 60,
      depositPercentage: 30,
      minProjectAmount: 175,
    });
    expect(result.services.raw).toMatchObject({
      services: expect.arrayContaining([
        expect.objectContaining({ key: 'soft-wash-siding' }),
      ]),
    });
    expect(result.warnings).toEqual([]);
  });

  it('falls back per-field when snapbid values are missing and warns once per field', async () => {
    const partial: MockDocSnap = {
      exists: true,
      data: () => ({ concreteRate: 0.2, roofRate: 0.3 }),
    };
    const result = await fetchRateCard({
      db: makeDb(partial, FULL_SERVICES),
    });
    expect(result.rateCard.concreteRate).toBe(0.2);
    expect(result.rateCard.roofRate).toBe(0.3);
    // Missing fields should be defaulted
    expect(result.rateCard.sidingRate).toBe(DEFAULT_RATE_CARD.sidingRate);
    expect(result.rateCard.minProjectAmount).toBe(DEFAULT_RATE_CARD.minProjectAmount);
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        'rate-card-missing:deckRate',
        'rate-card-missing:sidingRate',
        'rate-card-missing:vehicleRate',
        'rate-card-missing:depositPercentage',
        'rate-card-missing:minProjectAmount',
      ]),
    );
  });

  it('treats invalid (non-number, negative) values as missing', async () => {
    const bad: MockDocSnap = {
      exists: true,
      data: () => ({
        concreteRate: -0.5,
        roofRate: 'abc',
        deckRate: null,
      }),
    };
    const result = await fetchRateCard({ db: makeDb(bad, FULL_SERVICES) });
    expect(result.rateCard.concreteRate).toBe(DEFAULT_RATE_CARD.concreteRate);
    expect(result.rateCard.roofRate).toBe(DEFAULT_RATE_CARD.roofRate);
    expect(result.rateCard.deckRate).toBe(DEFAULT_RATE_CARD.deckRate);
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        'rate-card-invalid:concreteRate',
        'rate-card-invalid:roofRate',
        'rate-card-missing:deckRate',
      ]),
    );
  });

  it('falls back to full defaults + warning when the user_configs doc is absent', async () => {
    const absent: MockDocSnap = { exists: false, data: () => ({}) };
    const result = await fetchRateCard({
      db: makeDb(absent, FULL_SERVICES),
    });
    expect(result.rateCard).toEqual(DEFAULT_RATE_CARD);
    expect(result.warnings).toContain(
      'rate-card-doc-missing:settings/user_configs',
    );
  });

  it('captures a fetch error on user_configs and returns full defaults', async () => {
    const result = await fetchRateCard({
      db: makeDb(new Error('boom'), FULL_SERVICES),
    });
    expect(result.rateCard).toEqual(DEFAULT_RATE_CARD);
    expect(result.warnings.find((w) => w.startsWith('rate-card-fetch-error'))).toMatch(/boom/);
  });

  it('returns services.raw = null + warning when services doc is absent', async () => {
    const absent: MockDocSnap = { exists: false, data: () => ({}) };
    const result = await fetchRateCard({
      db: makeDb(FULL_CONFIG, absent),
    });
    expect(result.services.raw).toBeNull();
    expect(result.warnings).toContain(
      'service-catalog-doc-missing:settings/services',
    );
  });

  it('captures a fetch error on services and still returns rate-card', async () => {
    const result = await fetchRateCard({
      db: makeDb(FULL_CONFIG, new Error('services boom')),
    });
    expect(result.rateCard.concreteRate).toBe(0.2);
    expect(result.services.raw).toBeNull();
    expect(result.warnings.find((w) => w.startsWith('service-catalog-fetch-error'))).toMatch(/services boom/);
  });

  it('hits the two expected Firestore paths exactly once each', async () => {
    const calls: string[] = [];
    const db = {
      doc: (path: string) => {
        calls.push(path);
        const snap: MockDocSnap =
          path === 'settings/user_configs' ? FULL_CONFIG : FULL_SERVICES;
        return { get: () => Promise.resolve(snap) };
      },
    } as unknown as import('firebase-admin/firestore').Firestore;

    await fetchRateCard({ db });
    expect(calls).toEqual([
      'settings/user_configs',
      'settings/services',
    ]);
  });
});
