import { createRateLimiter, type RateLimiter } from './rate-limiter';

const ZONING_QUERY_URL =
  'https://gis.co.marion.or.us/arcgis/rest/services/Public/LandUsePlanningZoning/MapServer/2/query';
const DEFAULT_TIMEOUT_MS = 10_000;
const MIN_INTERVAL_MS = 250;

const defaultLimiter: RateLimiter = createRateLimiter(MIN_INTERVAL_MS);

export interface ZoningHit {
  zoningCode: string;
  zoningDescription?: string;
}

export interface ZoningQueryInput {
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

export async function fetchZoningAtPoint(
  input: ZoningQueryInput,
): Promise<ZoningHit | null> {
  const limiter = input.limiter ?? defaultLimiter;
  const fetchImpl = input.fetchImpl ?? fetch;
  const timeoutMs = input.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  await limiter.wait();

  const url = new URL(ZONING_QUERY_URL);
  url.searchParams.set('geometry', `${input.lng},${input.lat}`);
  url.searchParams.set('geometryType', 'esriGeometryPoint');
  url.searchParams.set('inSR', '4326');
  url.searchParams.set('spatialRel', 'esriSpatialRelIntersects');
  url.searchParams.set('outFields', 'ZONECODE,ZONEDESC');
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
      throw new Error(`Marion zoning HTTP ${res.status}`);
    }
    const data = (await res.json()) as EsriQueryResponse;
    if (data.error) {
      throw new Error(
        `Marion zoning error: ${JSON.stringify(data.error)}`,
      );
    }
    const feat = data.features?.[0];
    if (!feat) return null;

    const code = feat.attributes.ZONECODE;
    if (typeof code !== 'string' || code.length === 0) return null;

    const hit: ZoningHit = { zoningCode: code };
    const desc = feat.attributes.ZONEDESC;
    if (typeof desc === 'string' && desc.length > 0) {
      hit.zoningDescription = desc;
    }
    return hit;
  } finally {
    clearTimeout(timer);
  }
}
