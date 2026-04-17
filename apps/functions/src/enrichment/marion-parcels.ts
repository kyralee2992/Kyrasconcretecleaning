import type { EnrichmentParcel } from '@kyralee/shared-core';
import { createRateLimiter, type RateLimiter } from './rate-limiter';

const PARCELS_QUERY_URL =
  'https://gis.co.marion.or.us/arcgis/rest/services/Public/Parcels/MapServer/0/query';
const DEFAULT_TIMEOUT_MS = 10_000;
const MIN_INTERVAL_MS = 250;
const ACRES_TO_SQFT = 43_560;

const PARCEL_OUT_FIELDS = [
  'TAXLOT',
  'TAXACCT',
  'SITUS',
  'SITUSCSZ',
  'ACRES',
  'BLDGAREA',
  'LIVINGAREA',
  'ZONECODE',
  'PROPCLASS',
  'PRPCLSDESC',
  'YEARBUILT',
].join(',');

const defaultLimiter: RateLimiter = createRateLimiter(MIN_INTERVAL_MS);

export interface ParcelQueryInput {
  lat: number;
  lng: number;
  signal?: AbortSignal;
  fetchImpl?: typeof fetch;
  limiter?: RateLimiter;
  timeoutMs?: number;
}

interface EsriFeature {
  attributes: Record<string, unknown>;
}

interface EsriQueryResponse {
  features?: EsriFeature[];
  error?: { code?: number; message?: string };
}

function positiveNumberOrUndefined(v: unknown): number | undefined {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function nonEmptyStringOrUndefined(v: unknown): string | undefined {
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}

export async function fetchParcelAtPoint(
  input: ParcelQueryInput,
): Promise<EnrichmentParcel | null> {
  const limiter = input.limiter ?? defaultLimiter;
  const fetchImpl = input.fetchImpl ?? fetch;
  const timeoutMs = input.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  await limiter.wait();

  const url = new URL(PARCELS_QUERY_URL);
  url.searchParams.set('geometry', `${input.lng},${input.lat}`);
  url.searchParams.set('geometryType', 'esriGeometryPoint');
  url.searchParams.set('inSR', '4326');
  url.searchParams.set('spatialRel', 'esriSpatialRelIntersects');
  url.searchParams.set('outFields', PARCEL_OUT_FIELDS);
  url.searchParams.set('returnGeometry', 'false');
  url.searchParams.set('f', 'json');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  if (input.signal) {
    input.signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const res = await fetchImpl(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`Marion parcels HTTP ${res.status}`);
    }
    const data = (await res.json()) as EsriQueryResponse;
    if (data.error) {
      throw new Error(
        `Marion parcels error: ${JSON.stringify(data.error)}`,
      );
    }
    const feat = data.features?.[0];
    if (!feat) return null;

    const a = feat.attributes;
    const lotSizeAcres = positiveNumberOrUndefined(a.ACRES);
    const lotSizeSqFt =
      lotSizeAcres !== undefined
        ? Math.round(lotSizeAcres * ACRES_TO_SQFT)
        : undefined;

    const parcel: EnrichmentParcel = { source: 'marion-county-gis' };
    const parcelId = nonEmptyStringOrUndefined(a.TAXLOT);
    if (parcelId) parcel.parcelId = parcelId;
    const accountId = nonEmptyStringOrUndefined(a.TAXACCT);
    if (accountId) parcel.accountId = accountId;
    const situs = nonEmptyStringOrUndefined(a.SITUS);
    if (situs) parcel.situs = situs;
    const situsCsz = nonEmptyStringOrUndefined(a.SITUSCSZ);
    if (situsCsz) parcel.situsCsz = situsCsz;
    if (lotSizeAcres !== undefined) parcel.lotSizeAcres = lotSizeAcres;
    if (lotSizeSqFt !== undefined) parcel.lotSizeSqFt = lotSizeSqFt;
    const bldgArea = positiveNumberOrUndefined(a.BLDGAREA);
    if (bldgArea !== undefined) parcel.buildingAreaSqFt = bldgArea;
    const livingArea = positiveNumberOrUndefined(a.LIVINGAREA);
    if (livingArea !== undefined) parcel.livingAreaSqFt = livingArea;
    const zoningCode = nonEmptyStringOrUndefined(a.ZONECODE);
    if (zoningCode) parcel.zoningCode = zoningCode;
    const propertyClass = nonEmptyStringOrUndefined(a.PRPCLSDESC);
    if (propertyClass) parcel.propertyClass = propertyClass;
    const yearBuilt = positiveNumberOrUndefined(a.YEARBUILT);
    if (yearBuilt !== undefined) parcel.yearBuilt = yearBuilt;

    return parcel;
  } finally {
    clearTimeout(timer);
  }
}
