/**
 * Typed shapes for the inputs the autonomous drafter consumes. These
 * are INTERNAL to apps/functions — not exported from @kyralee/shared-core
 * because they're fetched from snapbid at runtime and don't cross the
 * web ↔ functions boundary.
 */

/**
 * Snapbid's settings/user_configs document. Rates for per-sqft surfaces
 * are in dollars-per-sqft; flat rates are in whole dollars. minProjectAmount
 * and depositPercentage mirror snapbid's own UI controls.
 *
 * Defaults here match snapbid's documented seed values (per the discovery
 * pass on the sibling Flutter app). The fetcher falls back to these when
 * a field is missing so a rename upstream doesn't bring the whole pipeline
 * down.
 */
export interface RateCard {
  concreteRate: number;
  roofRate: number;
  deckRate: number;
  sidingRate: number;
  vehicleRate: number;
  depositPercentage: number;
  minProjectAmount: number;
}

export const DEFAULT_RATE_CARD: RateCard = {
  concreteRate: 0.15,
  roofRate: 0.25,
  deckRate: 0.35,
  sidingRate: 250,
  vehicleRate: 50,
  depositPercentage: 25,
  minProjectAmount: 149,
};

/**
 * Snapbid's settings/services document. Exact shape is not yet known — it
 * may be an array, map, or something keyed by surface type. We pass it
 * through as unknown and let the prompt builder string-ify whatever it
 * finds so the model has the same service vocabulary Kyra uses manually.
 */
export interface ServiceCatalog {
  raw: Record<string, unknown> | null;
}

export interface RateCardFetchResult {
  rateCard: RateCard;
  services: ServiceCatalog;
  warnings: string[];
}
