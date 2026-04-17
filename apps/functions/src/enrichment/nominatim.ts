import type { EnrichmentGeocode } from '@kyralee/shared-core';
import { createRateLimiter, type RateLimiter } from './rate-limiter';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT =
  'kyraleecleaning-quoting-engine/0.1 (kyraleecleaning@gmail.com)';
const DEFAULT_TIMEOUT_MS = 10_000;
const MIN_INTERVAL_MS = 1000;

const defaultLimiter: RateLimiter = createRateLimiter(MIN_INTERVAL_MS);

export interface GeocodeOptions {
  signal?: AbortSignal;
  fetchImpl?: typeof fetch;
  limiter?: RateLimiter;
  timeoutMs?: number;
}

interface NominatimHit {
  lat: string;
  lon: string;
  display_name: string;
}

export async function geocodeAddress(
  address: string,
  opts: GeocodeOptions = {},
): Promise<EnrichmentGeocode | null> {
  const query = address.trim();
  if (!query) return null;

  const limiter = opts.limiter ?? defaultLimiter;
  const fetchImpl = opts.fetchImpl ?? fetch;
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  await limiter.wait();

  const url = new URL(NOMINATIM_URL);
  url.searchParams.set('q', query);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');
  url.searchParams.set('addressdetails', '0');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  if (opts.signal) {
    opts.signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const res = await fetchImpl(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
      },
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`Nominatim HTTP ${res.status}`);
    }
    const data = (await res.json()) as NominatimHit[];
    if (!Array.isArray(data) || data.length === 0) return null;

    const first = data[0]!;
    const lat = Number(first.lat);
    const lng = Number(first.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    return {
      lat,
      lng,
      formattedAddress: first.display_name,
      source: 'nominatim',
    };
  } finally {
    clearTimeout(timer);
  }
}
