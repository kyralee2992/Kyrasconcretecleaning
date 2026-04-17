import { createRateLimiter } from '../../enrichment/rate-limiter';

describe('createRateLimiter', () => {
  it('does not delay the very first call', async () => {
    const limiter = createRateLimiter(1000);
    const start = Date.now();
    await limiter.wait();
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(50);
  });

  it('enforces the minimum interval between consecutive calls', async () => {
    const limiter = createRateLimiter(150);
    await limiter.wait();
    const start = Date.now();
    await limiter.wait();
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(140);
  });

  it('does not double-delay when more than the interval has already passed', async () => {
    const limiter = createRateLimiter(100);
    await limiter.wait();
    await new Promise((r) => setTimeout(r, 120));
    const start = Date.now();
    await limiter.wait();
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(40);
  });
});
