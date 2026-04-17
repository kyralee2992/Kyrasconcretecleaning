import { enrichLead } from '../../enrichment/enrich-lead';
import type {
  EnrichmentGeocode,
  EnrichmentParcel,
} from '@kyralee/shared-core';

const FIXED_NOW = new Date('2026-04-17T12:00:00.000Z');
const now = () => FIXED_NOW;

const SAMPLE_GEOCODE: EnrichmentGeocode = {
  lat: 44.938,
  lng: -123.03,
  formattedAddress: '123 Main St, Salem, OR 97301',
  source: 'nominatim',
};

const SAMPLE_PARCEL: EnrichmentParcel = {
  source: 'marion-county-gis',
  parcelId: '073W27BC03100',
  lotSizeAcres: 0.1653,
  lotSizeSqFt: 7200,
  buildingAreaSqFt: 1850,
};

describe('enrichLead orchestrator', () => {
  it('stamps fetchedAt even on total failure', async () => {
    const result = await enrichLead({
      address: '',
      deps: {
        now,
        geocode: async () => null,
        fetchParcel: async () => null,
        fetchZoning: async () => null,
      },
    });
    expect(result.enrichment.fetchedAt).toBe(FIXED_NOW.toISOString());
  });

  it('returns nominatim-no-match warning and skips GIS calls when geocode misses', async () => {
    const parcelSpy = jest.fn();
    const zoningSpy = jest.fn();
    const result = await enrichLead({
      address: 'nowhere',
      deps: {
        now,
        geocode: async () => null,
        fetchParcel: parcelSpy,
        fetchZoning: zoningSpy,
      },
    });
    expect(result.warnings).toContain('nominatim-no-match');
    expect(result.enrichment.geocode).toBeUndefined();
    expect(parcelSpy).not.toHaveBeenCalled();
    expect(zoningSpy).not.toHaveBeenCalled();
  });

  it('captures nominatim-error when the geocoder throws', async () => {
    const result = await enrichLead({
      address: 'x',
      deps: {
        now,
        geocode: async () => {
          throw new Error('boom');
        },
        fetchParcel: jest.fn(),
        fetchZoning: jest.fn(),
      },
    });
    expect(result.warnings.find((w) => w.startsWith('nominatim-error'))).toMatch(/boom/);
  });

  it('runs parcel + zoning in parallel once geocode resolves', async () => {
    const order: string[] = [];
    const deps = {
      now,
      geocode: async (): Promise<EnrichmentGeocode> => {
        order.push('geocode');
        return SAMPLE_GEOCODE;
      },
      fetchParcel: async () => {
        order.push('parcel-start');
        await new Promise((r) => setTimeout(r, 20));
        order.push('parcel-end');
        return SAMPLE_PARCEL;
      },
      fetchZoning: async () => {
        order.push('zoning-start');
        await new Promise((r) => setTimeout(r, 10));
        order.push('zoning-end');
        return null;
      },
    };

    await enrichLead({ address: 'x', deps });

    // geocode runs first, then both GIS calls start before either ends
    expect(order[0]).toBe('geocode');
    const parcelStart = order.indexOf('parcel-start');
    const zoningStart = order.indexOf('zoning-start');
    const parcelEnd = order.indexOf('parcel-end');
    const zoningEnd = order.indexOf('zoning-end');
    // Parallelism: both start before either ends.
    expect(parcelStart).toBeLessThan(zoningEnd);
    expect(zoningStart).toBeLessThan(parcelEnd);
  });

  it('writes parcel and omits warnings when both GIS calls succeed', async () => {
    const result = await enrichLead({
      address: 'x',
      deps: {
        now,
        geocode: async () => SAMPLE_GEOCODE,
        fetchParcel: async () => SAMPLE_PARCEL,
        fetchZoning: async () => ({
          zoningCode: 'RS',
          zoningDescription: 'Residential Single Family',
        }),
      },
    });
    expect(result.warnings).toEqual([]);
    expect(result.enrichment.parcel?.parcelId).toBe('073W27BC03100');
    // zoning fallback doesn't clobber existing parcel fields
    expect(result.enrichment.parcel?.source).toBe('marion-county-gis');
  });

  it('fills zoningCode onto the parcel when the parcel lacks it but zoning returns one', async () => {
    const parcelWithoutZoning: EnrichmentParcel = {
      source: 'marion-county-gis',
      parcelId: 'abc',
    };
    const result = await enrichLead({
      address: 'x',
      deps: {
        now,
        geocode: async () => SAMPLE_GEOCODE,
        fetchParcel: async () => parcelWithoutZoning,
        fetchZoning: async () => ({
          zoningCode: 'PM',
          zoningDescription: 'Public Management',
        }),
      },
    });
    expect(result.enrichment.parcel?.zoningCode).toBe('PM');
    expect(result.enrichment.parcel?.zoningDescription).toBe('Public Management');
  });

  it('synthesizes a parcel from zoning alone when parcel returns null', async () => {
    const result = await enrichLead({
      address: 'x',
      deps: {
        now,
        geocode: async () => SAMPLE_GEOCODE,
        fetchParcel: async () => null,
        fetchZoning: async () => ({ zoningCode: 'UR' }),
      },
    });
    expect(result.warnings).toContain('marion-parcels-no-match');
    expect(result.enrichment.parcel).toEqual({
      source: 'marion-county-gis',
      zoningCode: 'UR',
    });
  });

  it('captures both error warnings when both GIS calls fail', async () => {
    const result = await enrichLead({
      address: 'x',
      deps: {
        now,
        geocode: async () => SAMPLE_GEOCODE,
        fetchParcel: async () => {
          throw new Error('parcel boom');
        },
        fetchZoning: async () => {
          throw new Error('zoning boom');
        },
      },
    });
    expect(result.warnings.find((w) => w.startsWith('marion-parcels-error'))).toMatch(/parcel boom/);
    expect(result.warnings.find((w) => w.startsWith('marion-zoning-error'))).toMatch(/zoning boom/);
    expect(result.enrichment.parcel).toBeUndefined();
    expect(result.enrichment.geocode).toEqual(SAMPLE_GEOCODE);
  });

  it('captures both no-match warnings when both GIS calls return null', async () => {
    const result = await enrichLead({
      address: 'x',
      deps: {
        now,
        geocode: async () => SAMPLE_GEOCODE,
        fetchParcel: async () => null,
        fetchZoning: async () => null,
      },
    });
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        'marion-parcels-no-match',
        'marion-zoning-no-match',
      ]),
    );
    expect(result.enrichment.parcel).toBeUndefined();
  });
});
