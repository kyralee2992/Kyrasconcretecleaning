export interface EnrichmentGeocode {
  lat: number;
  lng: number;
  formattedAddress: string;
  source: string;
}

export interface EnrichmentParcel {
  parcelId?: string;
  accountId?: string;
  situs?: string;
  situsCsz?: string;
  lotSizeAcres?: number;
  lotSizeSqFt?: number;
  buildingAreaSqFt?: number;
  livingAreaSqFt?: number;
  zoningCode?: string;
  zoningDescription?: string;
  propertyClass?: string;
  yearBuilt?: number;
  source?: string;
}

export interface Enrichment {
  geocode?: EnrichmentGeocode;
  parcel?: EnrichmentParcel;
  buildingFootprintSqFt?: number;
  rawSources?: Record<string, unknown>;
  fetchedAt: string;
}
