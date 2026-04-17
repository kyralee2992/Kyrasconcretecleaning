import type { Enrichment, EnrichmentParcel } from '@kyralee/shared-core';
import { geocodeAddress, type GeocodeOptions } from './nominatim';
import {
  fetchParcelAtPoint,
  type ParcelQueryInput,
} from './marion-parcels';
import {
  fetchZoningAtPoint,
  type ZoningQueryInput,
  type ZoningHit,
} from './marion-zoning';

export interface EnrichLeadDeps {
  geocode?: (address: string, opts?: GeocodeOptions) => ReturnType<typeof geocodeAddress>;
  fetchParcel?: (input: ParcelQueryInput) => ReturnType<typeof fetchParcelAtPoint>;
  fetchZoning?: (input: ZoningQueryInput) => ReturnType<typeof fetchZoningAtPoint>;
  now?: () => Date;
}

export interface EnrichLeadInput {
  address: string;
  deps?: EnrichLeadDeps;
}

export interface EnrichLeadResult {
  enrichment: Enrichment;
  warnings: string[];
}

function mergeZoningIntoParcel(
  parcel: EnrichmentParcel | null,
  zoning: ZoningHit | null,
): EnrichmentParcel | undefined {
  if (!parcel && !zoning) return undefined;
  if (parcel && !zoning) return parcel;
  if (!parcel && zoning) {
    const next: EnrichmentParcel = {
      source: 'marion-county-gis',
      zoningCode: zoning.zoningCode,
    };
    if (zoning.zoningDescription) next.zoningDescription = zoning.zoningDescription;
    return next;
  }
  // both present — fill missing zoning fields from the zoning layer
  const merged: EnrichmentParcel = { ...parcel! };
  if (!merged.zoningCode) merged.zoningCode = zoning!.zoningCode;
  if (!merged.zoningDescription && zoning!.zoningDescription) {
    merged.zoningDescription = zoning!.zoningDescription;
  }
  return merged;
}

export async function enrichLead(
  input: EnrichLeadInput,
): Promise<EnrichLeadResult> {
  const geocodeFn = input.deps?.geocode ?? geocodeAddress;
  const parcelFn = input.deps?.fetchParcel ?? fetchParcelAtPoint;
  const zoningFn = input.deps?.fetchZoning ?? fetchZoningAtPoint;
  const nowFn = input.deps?.now ?? (() => new Date());

  const warnings: string[] = [];
  const enrichment: Enrichment = { fetchedAt: nowFn().toISOString() };

  let geocode;
  try {
    geocode = await geocodeFn(input.address);
  } catch (err) {
    warnings.push(`nominatim-error: ${(err as Error).message}`);
    return { enrichment, warnings };
  }
  if (!geocode) {
    warnings.push('nominatim-no-match');
    return { enrichment, warnings };
  }
  enrichment.geocode = geocode;

  const point = { lat: geocode.lat, lng: geocode.lng };

  const [parcelResult, zoningResult] = await Promise.allSettled([
    parcelFn(point),
    zoningFn(point),
  ]);

  let parcel: EnrichmentParcel | null = null;
  if (parcelResult.status === 'fulfilled') {
    if (parcelResult.value) {
      parcel = parcelResult.value;
    } else {
      warnings.push('marion-parcels-no-match');
    }
  } else {
    warnings.push(
      `marion-parcels-error: ${(parcelResult.reason as Error).message}`,
    );
  }

  let zoning: ZoningHit | null = null;
  if (zoningResult.status === 'fulfilled') {
    if (zoningResult.value) {
      zoning = zoningResult.value;
    } else {
      warnings.push('marion-zoning-no-match');
    }
  } else {
    warnings.push(
      `marion-zoning-error: ${(zoningResult.reason as Error).message}`,
    );
  }

  const merged = mergeZoningIntoParcel(parcel, zoning);
  if (merged) enrichment.parcel = merged;

  return { enrichment, warnings };
}
