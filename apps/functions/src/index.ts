import { onRequest } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import type { Lead } from '@kyralee/shared-core';

initializeApp();

export const healthCheck = onRequest((_req, res) => {
  const sample: Pick<Lead, 'status'> = { status: 'new' };
  res.status(200).json({ ok: true, leadStatus: sample.status });
});

export { onLeadCreated } from './triggers/on-lead-created';
