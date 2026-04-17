import { fetchZoningAtPoint } from '../../enrichment/marion-zoning';

function makeResponse(
  body: unknown,
  init: { ok?: boolean; status?: number } = {},
): Response {
  return {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: async () => body,
  } as unknown as Response;
}

const noopLimiter = { wait: async () => undefined };
const SALEM = { lat: 44.938, lng: -123.03 };

describe('fetchZoningAtPoint (Marion County GIS)', () => {
  it('returns null when no features match', async () => {
    const fetchImpl = jest
      .fn()
      .mockResolvedValue(makeResponse({ features: [] }));
    const result = await fetchZoningAtPoint({
      ...SALEM,
      fetchImpl: fetchImpl as unknown as typeof fetch,
      limiter: noopLimiter,
    });
    expect(result).toBeNull();
  });

  it('maps a zoning feature into code + description', async () => {
    const fetchImpl = jest.fn().mockResolvedValue(
      makeResponse({
        features: [
          {
            attributes: {
              ZONECODE: 'RS',
              ZONEDESC: 'Residential Single Family',
            },
          },
        ],
      }),
    );

    const result = await fetchZoningAtPoint({
      ...SALEM,
      fetchImpl: fetchImpl as unknown as typeof fetch,
      limiter: noopLimiter,
    });

    expect(result).toEqual({
      zoningCode: 'RS',
      zoningDescription: 'Residential Single Family',
    });
  });

  it('omits description when missing or blank', async () => {
    const fetchImpl = jest.fn().mockResolvedValue(
      makeResponse({
        features: [
          {
            attributes: { ZONECODE: 'PM', ZONEDESC: '' },
          },
        ],
      }),
    );
    const result = await fetchZoningAtPoint({
      ...SALEM,
      fetchImpl: fetchImpl as unknown as typeof fetch,
      limiter: noopLimiter,
    });
    expect(result).toEqual({ zoningCode: 'PM' });
  });

  it('returns null when ZONECODE is missing or blank', async () => {
    const fetchImpl = jest.fn().mockResolvedValue(
      makeResponse({
        features: [{ attributes: { ZONECODE: '', ZONEDESC: 'x' } }],
      }),
    );
    const result = await fetchZoningAtPoint({
      ...SALEM,
      fetchImpl: fetchImpl as unknown as typeof fetch,
      limiter: noopLimiter,
    });
    expect(result).toBeNull();
  });

  it('throws on non-ok HTTP response', async () => {
    const fetchImpl = jest
      .fn()
      .mockResolvedValue(makeResponse({}, { ok: false, status: 502 }));
    await expect(
      fetchZoningAtPoint({
        ...SALEM,
        fetchImpl: fetchImpl as unknown as typeof fetch,
        limiter: noopLimiter,
      }),
    ).rejects.toThrow(/HTTP 502/);
  });

  it('constructs the correct ArcGIS query URL', async () => {
    const fetchImpl = jest
      .fn()
      .mockResolvedValue(makeResponse({ features: [] }));
    await fetchZoningAtPoint({
      ...SALEM,
      fetchImpl: fetchImpl as unknown as typeof fetch,
      limiter: noopLimiter,
    });
    const url = fetchImpl.mock.calls[0]![0] as URL;
    expect(url.pathname).toContain('LandUsePlanningZoning/MapServer/2/query');
    expect(url.searchParams.get('outFields')).toBe('ZONECODE,ZONEDESC');
    expect(url.searchParams.get('inSR')).toBe('4326');
  });
});
