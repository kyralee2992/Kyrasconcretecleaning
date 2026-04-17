import type { Firestore } from 'firebase-admin/firestore';
import {
  DEFAULT_RATE_CARD,
  type RateCard,
  type RateCardFetchResult,
  type ServiceCatalog,
} from './types';

const USER_CONFIGS_PATH = 'settings/user_configs';
const SERVICES_PATH = 'settings/services';

function readPositiveNumber(
  source: Record<string, unknown> | undefined,
  key: keyof RateCard,
  fallback: number,
  warnings: string[],
): number {
  const raw = source?.[key];
  if (raw === undefined || raw === null) {
    warnings.push(`rate-card-missing:${key}`);
    return fallback;
  }
  const num = typeof raw === 'number' ? raw : Number(raw);
  if (!Number.isFinite(num) || num < 0) {
    warnings.push(`rate-card-invalid:${key}`);
    return fallback;
  }
  return num;
}

export interface FetchRateCardOptions {
  db: Firestore;
}

export async function fetchRateCard(
  opts: FetchRateCardOptions,
): Promise<RateCardFetchResult> {
  const warnings: string[] = [];

  const [configSnap, servicesSnap] = await Promise.allSettled([
    opts.db.doc(USER_CONFIGS_PATH).get(),
    opts.db.doc(SERVICES_PATH).get(),
  ]);

  let configData: Record<string, unknown> | undefined;
  if (configSnap.status === 'fulfilled') {
    if (configSnap.value.exists) {
      configData = configSnap.value.data() as Record<string, unknown>;
    } else {
      warnings.push('rate-card-doc-missing:settings/user_configs');
    }
  } else {
    warnings.push(
      `rate-card-fetch-error: ${(configSnap.reason as Error).message}`,
    );
  }

  const rateCard: RateCard = {
    concreteRate: readPositiveNumber(
      configData,
      'concreteRate',
      DEFAULT_RATE_CARD.concreteRate,
      warnings,
    ),
    roofRate: readPositiveNumber(
      configData,
      'roofRate',
      DEFAULT_RATE_CARD.roofRate,
      warnings,
    ),
    deckRate: readPositiveNumber(
      configData,
      'deckRate',
      DEFAULT_RATE_CARD.deckRate,
      warnings,
    ),
    sidingRate: readPositiveNumber(
      configData,
      'sidingRate',
      DEFAULT_RATE_CARD.sidingRate,
      warnings,
    ),
    vehicleRate: readPositiveNumber(
      configData,
      'vehicleRate',
      DEFAULT_RATE_CARD.vehicleRate,
      warnings,
    ),
    depositPercentage: readPositiveNumber(
      configData,
      'depositPercentage',
      DEFAULT_RATE_CARD.depositPercentage,
      warnings,
    ),
    minProjectAmount: readPositiveNumber(
      configData,
      'minProjectAmount',
      DEFAULT_RATE_CARD.minProjectAmount,
      warnings,
    ),
  };

  let services: ServiceCatalog = { raw: null };
  if (servicesSnap.status === 'fulfilled') {
    if (servicesSnap.value.exists) {
      services = { raw: servicesSnap.value.data() as Record<string, unknown> };
    } else {
      warnings.push('service-catalog-doc-missing:settings/services');
    }
  } else {
    warnings.push(
      `service-catalog-fetch-error: ${(servicesSnap.reason as Error).message}`,
    );
  }

  return { rateCard, services, warnings };
}
