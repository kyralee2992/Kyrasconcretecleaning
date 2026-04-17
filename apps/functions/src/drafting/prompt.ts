import type { Lead } from '@kyralee/shared-core';
import type { RateCard, ServiceCatalog } from './types';

/**
 * JSON-schema tool definition the model is forced to call. Kept here
 * (and not in anthropic-client.ts) so prompt edits and tool-schema edits
 * live together — they're always reviewed as a unit.
 */
export const DRAFT_QUOTE_TOOL = {
  name: 'draft_quote',
  description:
    'Produce a draft quote for the cleaning lead. Always call this tool; never reply with free text.',
  input_schema: {
    type: 'object' as const,
    properties: {
      lineItems: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            description: { type: 'string', minLength: 1 },
            quantityDesc: { type: 'string' },
            amountCents: { type: 'integer', minimum: 0 },
          },
          required: ['description', 'amountCents'],
          additionalProperties: false,
        },
      },
      totalCents: { type: 'integer', minimum: 0 },
      draftReasoning: { type: 'string', minLength: 1 },
      confidenceWarnings: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    required: ['lineItems', 'totalCents', 'draftReasoning'],
    additionalProperties: false,
  },
};

export interface PromptInputs {
  lead: Lead;
  rateCard: RateCard;
  services: ServiceCatalog;
}

/**
 * Stable across leads — safe to prompt-cache. Contains the pricing rubric
 * fetched from snapbid + guidance on how the model should apply it.
 */
export function buildSystemPrompt(
  rateCard: RateCard,
  services: ServiceCatalog,
): string {
  const rc = rateCard;
  const servicesBlock =
    services.raw !== null
      ? `## Service catalog (from snapbid/settings/services)\n${JSON.stringify(services.raw, null, 2)}\n`
      : `## Service catalog\nNo snapbid service catalog available; use plain-English line-item descriptions.\n`;

  return `You are an autonomous draft-quoter for Kyra Lee Cleaning, a residential pressure-washing and soft-washing service in Salem, Oregon.

A human (Kyra) reviews every quote you produce before it reaches the customer. Your job is to produce a defensible starting point based on the pricing rubric below — not a final bill. Kyra will edit or reject anything she disagrees with.

## Pricing rubric (from snapbid/settings/user_configs — treat these as the single source of truth)
- Concrete / flatwork: $${rc.concreteRate.toFixed(2)} per sqft
- Roof / shingles: $${rc.roofRate.toFixed(2)} per sqft
- Deck / wood: $${rc.deckRate.toFixed(2)} per sqft
- Siding (soft wash): $${rc.sidingRate.toFixed(0)} flat for a typical residential home
- Vehicle (mobile wash): $${rc.vehicleRate.toFixed(0)} flat
- Deposit: ${rc.depositPercentage.toFixed(0)}% required at booking (informational — do not add as a line item)
- Minimum project: $${rc.minProjectAmount.toFixed(0)} — any total below this must be rounded UP to the minimum and flagged in confidenceWarnings.

${servicesBlock}
## Surface sizing heuristics
Use the enrichment payload's building area and lot size to estimate treatable surface. When the data is missing or clearly sparse, be conservative and add an explicit confidenceWarning:
- Driveway / concrete flatwork: typically ~15–25% of (lot area - building footprint). Bias LOW when uncertain.
- Roof sqft: roughly 1.3× building footprint (pitch adjustment).
- Siding rate is flat for a "typical" home. If building area is clearly oversized (>3000 sqft) or undersized (<900 sqft), note it in reasoning and adjust proportionally.
- If building area OR lot size is missing from enrichment, quote the minimum project and add confidenceWarning: "sizing-unknown".

## Service-field mapping
The website form's requestedService field uses these exact labels:
- "Soft Washing (Siding)" → siding rate; include roof if building area clearly warrants (>2200 sqft).
- "Deep Cleaning (Concrete)" → concrete rate × estimated flatwork sqft.
- "Both Services" → siding + concrete combined into one quote.
- "Not Sure Yet" → read the customer's message field carefully, infer the most likely surface(s), include confidenceWarning: "service-inferred-from-message".

## Commercial vs residential
Property class and zoning are in the enrichment payload. If they indicate commercial, industrial, or institutional (e.g. zoning PM, CG, CR; property class does NOT say "RESIDENTIAL"), add confidenceWarning: "commercial-property-residential-rates-may-not-apply". Hold rates the same — Kyra can adjust in her review.

## Output discipline
- Always call the draft_quote tool. Never reply with free text.
- Produce at least one line item. Round each line item to the nearest whole dollar (amountCents must be a multiple of 100).
- totalCents MUST equal the exact sum of lineItems[].amountCents.
- totalCents MUST be ≥ $${rc.minProjectAmount.toFixed(0)} in cents ($${rc.minProjectAmount.toFixed(0) + '00'}). If the math comes out lower, round up and add a confidenceWarning.
- draftReasoning: 1–3 short sentences. Mention the concrete numbers (sqft, rates) so Kyra can sanity-check in seconds.`;
}

/**
 * Per-lead — not cached. Contains the lead's own data + enrichment so the
 * model has everything it needs for pricing judgment.
 */
export function buildUserPrompt(lead: Lead): string {
  const enrichment = lead.enrichment ?? { fetchedAt: lead.updatedAt };
  const warnings = lead.enrichmentWarnings ?? [];

  const serialized = {
    lead: {
      clientName: lead.clientName,
      address: lead.address,
      requestedService: lead.requestedService,
      message: lead.message ?? null,
      preferredDate: lead.preferredDate ?? null,
      preferredTime: lead.preferredTime ?? null,
    },
    enrichment,
    enrichmentWarnings: warnings,
  };

  return [
    'Draft a quote for the following lead. Use the tool; no free text.',
    '',
    '```json',
    JSON.stringify(serialized, null, 2),
    '```',
  ].join('\n');
}

export function buildPrompt(inputs: PromptInputs): {
  systemPrompt: string;
  userPrompt: string;
} {
  return {
    systemPrompt: buildSystemPrompt(inputs.rateCard, inputs.services),
    userPrompt: buildUserPrompt(inputs.lead),
  };
}
