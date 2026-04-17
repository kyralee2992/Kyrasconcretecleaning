import { z } from 'zod';
import type { Lead, Quote, QuoteLineItem } from '@kyralee/shared-core';
import type {
  DraftQuoteApi,
  DraftQuoteToolOutput,
} from './anthropic-client';
import { buildPrompt } from './prompt';
import type { RateCard, ServiceCatalog } from './types';

const ToolOutputSchema = z.object({
  lineItems: z
    .array(
      z.object({
        description: z.string().min(1),
        quantityDesc: z.string().optional(),
        amountCents: z.number().int().min(0),
      }),
    )
    .min(1),
  totalCents: z.number().int().min(0),
  draftReasoning: z.string().min(1),
  confidenceWarnings: z.array(z.string()).optional(),
});

export interface DraftQuoteContext {
  lead: Lead;
  rateCard: RateCard;
  services: ServiceCatalog;
  api: DraftQuoteApi;
  now?: () => Date;
  newQuoteId?: () => string;
}

export interface DraftQuoteResult {
  quote: Omit<Quote, 'id'> & { id: string };
  warnings: string[];
}

function enforceInvariants(
  output: DraftQuoteToolOutput,
  rateCard: RateCard,
): { adjusted: DraftQuoteToolOutput; warnings: string[] } {
  const warnings: string[] = [];
  const minCents = Math.round(rateCard.minProjectAmount * 100);

  const sum = output.lineItems.reduce(
    (acc, item) => acc + item.amountCents,
    0,
  );
  if (sum !== output.totalCents) {
    throw new Error(
      `invariant-violation: totalCents (${output.totalCents}) != sum of lineItems (${sum})`,
    );
  }

  if (output.totalCents < minCents) {
    throw new Error(
      `invariant-violation: totalCents (${output.totalCents}) below minProjectAmount (${minCents})`,
    );
  }

  for (const item of output.lineItems) {
    if (item.amountCents % 100 !== 0) {
      warnings.push(
        `line-item-not-whole-dollar:${item.description}:${item.amountCents}`,
      );
    }
  }

  return { adjusted: output, warnings };
}

function defaultQuoteId(): string {
  // 20-char base36 — plenty of entropy for our volume and shorter than a UUID.
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 12).padStart(10, '0')
  );
}

export async function draftQuote(
  ctx: DraftQuoteContext,
): Promise<DraftQuoteResult> {
  const nowFn = ctx.now ?? (() => new Date());
  const idFn = ctx.newQuoteId ?? defaultQuoteId;

  const { systemPrompt, userPrompt } = buildPrompt({
    lead: ctx.lead,
    rateCard: ctx.rateCard,
    services: ctx.services,
  });

  const raw = await ctx.api.callDraftQuoteTool({ systemPrompt, userPrompt });
  const parsed = ToolOutputSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(
      `tool-output-schema-violation: ${parsed.error.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join('; ')}`,
    );
  }

  const { adjusted, warnings } = enforceInvariants(parsed.data, ctx.rateCard);

  const lineItems: QuoteLineItem[] = adjusted.lineItems.map((li) => {
    const item: QuoteLineItem = {
      description: li.description,
      amountCents: li.amountCents,
    };
    if (li.quantityDesc) item.quantityDesc = li.quantityDesc;
    return item;
  });

  const modelWarnings = adjusted.confidenceWarnings ?? [];
  const combinedWarnings = [...modelWarnings, ...warnings];

  const nowIso = nowFn().toISOString();
  const quote: Omit<Quote, 'id'> & { id: string } = {
    id: idFn(),
    leadId: ctx.lead.id,
    lineItems,
    totalCents: adjusted.totalCents,
    currency: 'usd',
    draftSource: 'autonomous',
    draftReasoning: adjusted.draftReasoning,
    approvalStatus: 'draft',
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  return { quote, warnings: combinedWarnings };
}
