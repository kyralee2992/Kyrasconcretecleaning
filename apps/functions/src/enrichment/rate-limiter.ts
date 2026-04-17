export interface RateLimiter {
  wait(): Promise<void>;
}

export function createRateLimiter(minIntervalMs: number): RateLimiter {
  let lastCallAt = 0;
  return {
    async wait() {
      const now = Date.now();
      const elapsed = now - lastCallAt;
      if (elapsed < minIntervalMs) {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, minIntervalMs - elapsed);
        });
      }
      lastCallAt = Date.now();
    },
  };
}
