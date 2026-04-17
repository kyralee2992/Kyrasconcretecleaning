import { geocodeAddress } from '../../enrichment/nominatim';
import { createRateLimiter } from '../../enrichment/rate-limiter';

function makeResponse(body: unknown, init: { ok?: boolean; status?: number } = {}): Response {
  return {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: async () => body,
  } as unknown as Response;
}

const noopLimiter = { wait: async () => undefined };

describe('geocodeAddress (Nominatim)', () => {
  it('returns null when the address is blank', async () => {
    const fetchImpl = jest.fn();
    const result = await geocodeAddress('   ', {
      fetchImpl: fetchImpl as unknown as typeof fetch,
      limiter: noopLimiter,
    });
    expect(result).toBeNull();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('parses a single-hit response into EnrichmentGeocode', async () => {
    const fetchImpl = jest.fn().mockResolvedValue(
      makeResponse([
        {
          lat: '44.9429',
          lon: '-123.0351',
          display_name: '123 Main St, Salem, OR 97301',
        },
      ]),
    );

    const result = await geocodeAddress('123 Main St, Salem, OR', {
      fetchImpl: fetchImpl as unknown as typeof fetch,
      limiter: noopLimiter,
    });

    expect(result).toEqual({
      lat: 44.9429,
      lng: -123.0351,
      formattedAddress: '123 Main St, Salem, OR 97301',
      source: 'nominatim',
    });
  });

  it('sends the required User-Agent header', async () => {
    const fetchImpl = jest.fn().mockResolvedValue(
      makeResponse([{ lat: '1', lon: '2', display_name: 'x' }]),
    );
    await geocodeAddress('x', {
      fetchImpl: fetchImpl as unknown as typeof fetch,
      limiter: noopLimiter,
    });
    const callArgs = fetchImpl.mock.calls[0]!;
    const init = callArgs[1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    expect(headers['User-Agent']).toMatch(
      /kyraleecleaning-quoting-engine.*kyraleecleaning@gmail\.com/,
    );
  });

  it('hits the Nominatim search URL with the expected query params', async () => {
    const fetchImpl = jest.fn().mockResolvedValue(
      makeResponse([{ lat: '1', lon: '2', display_name: 'x' }]),
    );
    await geocodeAddress('100 Court St NE, Salem, OR', {
      fetchImpl: fetchImpl as unknown as typeof fetch,
      limiter: noopLimiter,
    });
    const urlArg = fetchImpl.mock.calls[0]![0] as URL;
    expect(urlArg.hostname).toBe('nominatim.openstreetmap.org');
    expect(urlArg.searchParams.get('q')).toBe('100 Court St NE, Salem, OR');
    expect(urlArg.searchParams.get('format')).toBe('json');
    expect(urlArg.searchParams.get('limit')).toBe('1');
  });

  it('returns null when no results are returned', async () => {
    const fetchImpl = jest.fn().mockResolvedValue(makeResponse([]));
    const result = await geocodeAddress('nowhere', {
      fetchImpl: fetchImpl as unknown as typeof fetch,
      limiter: noopLimiter,
    });
    expect(result).toBeNull();
  });

  it('throws on non-ok HTTP response', async () => {
    const fetchImpl = jest
      .fn()
      .mockResolvedValue(makeResponse({}, { ok: false, status: 503 }));
    await expect(
      geocodeAddress('x', {
        fetchImpl: fetchImpl as unknown as typeof fetch,
        limiter: noopLimiter,
      }),
    ).rejects.toThrow(/HTTP 503/);
  });

  it('returns null when lat/lng fail to parse', async () => {
    const fetchImpl = jest.fn().mockResolvedValue(
      makeResponse([{ lat: 'banana', lon: 'x', display_name: 'bad' }]),
    );
    const result = await geocodeAddress('x', {
      fetchImpl: fetchImpl as unknown as typeof fetch,
      limiter: noopLimiter,
    });
    expect(result).toBeNull();
  });

  it('calls limiter.wait before each request', async () => {
    const waitSpy = jest.fn().mockResolvedValue(undefined);
    const limiter = { wait: waitSpy };
    const fetchImpl = jest.fn().mockResolvedValue(
      makeResponse([{ lat: '1', lon: '2', display_name: 'x' }]),
    );
    await geocodeAddress('x', {
      fetchImpl: fetchImpl as unknown as typeof fetch,
      limiter,
    });
    expect(waitSpy).toHaveBeenCalledTimes(1);
    // Ensure limiter.wait was called BEFORE fetch
    const waitOrder = waitSpy.mock.invocationCallOrder[0]!;
    const fetchOrder = fetchImpl.mock.invocationCallOrder[0]!;
    expect(waitOrder).toBeLessThan(fetchOrder);
  });

  it('smoke: default limiter resolves', async () => {
    // Just ensure the module-level default limiter is exported/usable.
    const r = createRateLimiter(0);
    await r.wait();
    expect(true).toBe(true);
  });
});
