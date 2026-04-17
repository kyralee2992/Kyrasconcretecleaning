import { fetchParcelAtPoint } from '../../enrichment/marion-parcels';

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

describe('fetchParcelAtPoint (Marion County GIS)', () => {
  it('returns null when no features match', async () => {
    const fetchImpl = jest
      .fn()
      .mockResolvedValue(makeResponse({ features: [] }));
    const result = await fetchParcelAtPoint({
      ...SALEM,
      fetchImpl: fetchImpl as unknown as typeof fetch,
      limiter: noopLimiter,
    });
    expect(result).toBeNull();
  });

  it('maps a full-attribute feature into EnrichmentParcel', async () => {
    const fetchImpl = jest.fn().mockResolvedValue(
      makeResponse({
        features: [
          {
            attributes: {
              TAXLOT: '073W27BC03100',
              TAXACCT: 'R12345',
              SITUS: '123 MAIN ST',
              SITUSCSZ: 'SALEM, OR, 97301',
              ACRES: 0.1653,
              BLDGAREA: 1850,
              LIVINGAREA: 1600,
              ZONECODE: 'RS',
              PROPCLASS: '101',
              PRPCLSDESC: 'RESIDENTIAL 1-3 UNITS',
              YEARBUILT: 1978,
            },
          },
        ],
      }),
    );

    const result = await fetchParcelAtPoint({
      ...SALEM,
      fetchImpl: fetchImpl as unknown as typeof fetch,
      limiter: noopLimiter,
    });

    expect(result).toEqual({
      source: 'marion-county-gis',
      parcelId: '073W27BC03100',
      accountId: 'R12345',
      situs: '123 MAIN ST',
      situsCsz: 'SALEM, OR, 97301',
      lotSizeAcres: 0.1653,
      lotSizeSqFt: Math.round(0.1653 * 43560),
      buildingAreaSqFt: 1850,
      livingAreaSqFt: 1600,
      zoningCode: 'RS',
      propertyClass: 'RESIDENTIAL 1-3 UNITS',
      yearBuilt: 1978,
    });
  });

  it('omits fields that are zero, missing, or blank', async () => {
    const fetchImpl = jest.fn().mockResolvedValue(
      makeResponse({
        features: [
          {
            attributes: {
              TAXLOT: '073W26BB04900',
              TAXACCT: '',
              SITUS: '1130 COURT ST NE',
              SITUSCSZ: 'SALEM, OR, 97301',
              ACRES: 3.53,
              BLDGAREA: 10,
              LIVINGAREA: 0,
              ZONECODE: 'PM',
              PROPCLASS: '961',
              PRPCLSDESC: 'STATE IMPROVED',
              YEARBUILT: 0,
            },
          },
        ],
      }),
    );

    const result = await fetchParcelAtPoint({
      ...SALEM,
      fetchImpl: fetchImpl as unknown as typeof fetch,
      limiter: noopLimiter,
    });

    expect(result).not.toBeNull();
    expect(result!.parcelId).toBe('073W26BB04900');
    expect(result!.buildingAreaSqFt).toBe(10);
    // LIVINGAREA=0, YEARBUILT=0, and TAXACCT='' should all drop out
    expect(result).not.toHaveProperty('livingAreaSqFt');
    expect(result).not.toHaveProperty('yearBuilt');
    expect(result).not.toHaveProperty('accountId');
  });

  it('throws on non-ok HTTP response', async () => {
    const fetchImpl = jest
      .fn()
      .mockResolvedValue(makeResponse({}, { ok: false, status: 500 }));
    await expect(
      fetchParcelAtPoint({
        ...SALEM,
        fetchImpl: fetchImpl as unknown as typeof fetch,
        limiter: noopLimiter,
      }),
    ).rejects.toThrow(/HTTP 500/);
  });

  it('throws when the response body carries an Esri error object', async () => {
    const fetchImpl = jest.fn().mockResolvedValue(
      makeResponse({ error: { code: 400, message: 'bad geometry' } }),
    );
    await expect(
      fetchParcelAtPoint({
        ...SALEM,
        fetchImpl: fetchImpl as unknown as typeof fetch,
        limiter: noopLimiter,
      }),
    ).rejects.toThrow(/bad geometry/);
  });

  it('constructs the correct ArcGIS query URL', async () => {
    const fetchImpl = jest
      .fn()
      .mockResolvedValue(makeResponse({ features: [] }));
    await fetchParcelAtPoint({
      ...SALEM,
      fetchImpl: fetchImpl as unknown as typeof fetch,
      limiter: noopLimiter,
    });
    const url = fetchImpl.mock.calls[0]![0] as URL;
    expect(url.hostname).toBe('gis.co.marion.or.us');
    expect(url.pathname).toContain('Parcels/MapServer/0/query');
    expect(url.searchParams.get('geometry')).toBe(`${SALEM.lng},${SALEM.lat}`);
    expect(url.searchParams.get('inSR')).toBe('4326');
    expect(url.searchParams.get('f')).toBe('json');
    expect(url.searchParams.get('outFields')).toMatch(/TAXLOT/);
    expect(url.searchParams.get('outFields')).toMatch(/BLDGAREA/);
  });
});
