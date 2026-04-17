import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions/v2';
import { defineSecret } from 'firebase-functions/params';
import { getFirestore } from 'firebase-admin/firestore';
import type { Lead } from '@kyralee/shared-core';
import { fetchRateCard } from '../drafting/rate-card';
import { createDraftQuoteApi } from '../drafting/anthropic-client';
import { draftQuote } from '../drafting/draft-quote';

const ANTHROPIC_API_KEY = defineSecret('ANTHROPIC_API_KEY');

export const onLeadEnriched = onDocumentUpdated(
  {
    document: 'leads/{leadId}',
    secrets: [ANTHROPIC_API_KEY],
  },
  async (event) => {
    const leadId = event.params.leadId;
    const after = event.data?.after;
    const before = event.data?.before;
    if (!after || !before) {
      logger.warn('onLeadEnriched fired without both snapshots', { leadId });
      return;
    }

    const lead = after.data() as Lead;
    const prior = before.data() as Lead;

    // Fire only on the enriching → enriched transition, and only once.
    const isTransition =
      prior.status !== 'enriched' && lead.status === 'enriched';
    if (!isTransition) {
      return;
    }
    if (lead.quoteId) {
      logger.info('onLeadEnriched skipping: quoteId already set', {
        leadId,
        quoteId: lead.quoteId,
      });
      return;
    }

    await after.ref.update({
      status: 'drafting',
      updatedAt: new Date().toISOString(),
    });

    try {
      const db = getFirestore();
      const { rateCard, services, warnings: rateWarnings } =
        await fetchRateCard({ db });

      const api = createDraftQuoteApi({
        apiKey: ANTHROPIC_API_KEY.value(),
      });

      const { quote, warnings: draftWarnings } = await draftQuote({
        lead: { ...lead, id: leadId },
        rateCard,
        services,
        api,
      });

      // Write the quote first so the lead always points at a real doc.
      await db.collection('quotes').doc(quote.id).set(quote);

      const leadPatch: Record<string, unknown> = {
        status: 'drafted',
        quoteId: quote.id,
        draftedAt: quote.createdAt,
        updatedAt: new Date().toISOString(),
      };
      await after.ref.update(leadPatch);

      logger.info('onLeadEnriched drafted', {
        leadId,
        quoteId: quote.id,
        totalCents: quote.totalCents,
        lineItemCount: quote.lineItems.length,
        rateCardWarnings: rateWarnings.length,
        draftWarnings: draftWarnings.length,
      });
    } catch (err) {
      const message = (err as Error).message;
      logger.error('onLeadEnriched drafter failed', { leadId, err: message });
      await after.ref.update({
        status: 'enriched',
        draftingError: message,
        updatedAt: new Date().toISOString(),
      });
    }
  },
);
