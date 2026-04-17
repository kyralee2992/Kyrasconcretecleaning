import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions/v2';
import type { Lead } from '@kyralee/shared-core';
import { enrichLead } from '../enrichment/enrich-lead';

export const onLeadCreated = onDocumentCreated(
  'leads/{leadId}',
  async (event) => {
    const snap = event.data;
    if (!snap) {
      logger.warn('onLeadCreated fired without snapshot', {
        leadId: event.params.leadId,
      });
      return;
    }

    const leadId = event.params.leadId;
    const lead = snap.data() as Lead;

    if (lead.status !== 'new') {
      logger.info('onLeadCreated skipping: status already past new', {
        leadId,
        status: lead.status,
      });
      return;
    }

    const address = lead.address;
    if (!address || !address.trim()) {
      logger.warn('onLeadCreated skipping: blank address', { leadId });
      await snap.ref.update({
        status: 'enriched',
        enrichmentWarnings: ['blank-address'],
        updatedAt: new Date().toISOString(),
      });
      return;
    }

    await snap.ref.update({
      status: 'enriching',
      updatedAt: new Date().toISOString(),
    });

    try {
      const { enrichment, warnings } = await enrichLead({ address });

      const patch: Record<string, unknown> = {
        status: 'enriched',
        enrichment,
        updatedAt: new Date().toISOString(),
      };
      if (warnings.length > 0) patch.enrichmentWarnings = warnings;

      await snap.ref.update(patch);

      logger.info('onLeadCreated enriched', {
        leadId,
        warningCount: warnings.length,
        hasParcel: Boolean(enrichment.parcel),
        hasGeocode: Boolean(enrichment.geocode),
      });
    } catch (err) {
      const message = (err as Error).message;
      logger.error('onLeadCreated enrichment threw', { leadId, err: message });
      await snap.ref.update({
        status: 'enriched',
        enrichmentWarnings: [`orchestrator-error: ${message}`],
        updatedAt: new Date().toISOString(),
      });
    }
  },
);
