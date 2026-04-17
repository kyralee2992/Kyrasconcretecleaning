export interface EnrichmentGeocode {
  lat: number;
  lng: number;
  formattedAddress: string;
  source: string;
}

export interface EnrichmentParcel {
  parcelId?: string;
  lotSizeSqFt?: number;
  zoningCode?: string;
  source?: string;
}

export interface Enrichment {
  geocode?: EnrichmentGeocode;
  parcel?: EnrichmentParcel;
  buildingFootprintSqFt?: number;
  rawSources?: Record<string, unknown>;
  fetchedAt: string;
}
