import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import type { LeadStatus } from '@kyralee/shared-core';

const LeadRequestSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().toLowerCase().email().max(320),
  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal(''))
    .transform((v) => (v ? v : undefined)),
  address: z.string().trim().min(1).max(500),
  serviceType: z.string().trim().min(1).max(200),
  preferredDate: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal(''))
    .transform((v) => (v ? v : undefined)),
  preferredTime: z
    .string()
    .trim()
    .max(80)
    .optional()
    .or(z.literal(''))
    .transform((v) => (v ? v : undefined)),
  message: z
    .string()
    .trim()
    .max(5000)
    .optional()
    .or(z.literal(''))
    .transform((v) => (v ? v : undefined)),
});

const OPEN_STATUSES: LeadStatus[] = [
  'new',
  'enriching',
  'enriched',
  'drafted',
];

const DEDUPE_WINDOW_MS = 5 * 60 * 1000;

function normalizeAddress(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ').toLowerCase();
}

export async function POST(request: Request): Promise<Response> {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const parsed = LeadRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const emailLower = data.email;
  const addressNormalized = normalizeAddress(data.address);
  const nowIso = new Date().toISOString();
  const cutoffIso = new Date(Date.now() - DEDUPE_WINDOW_MS).toISOString();

  try {
    const leadsCol = adminDb().collection('leads');

    const existing = await leadsCol
      .where('emailLower', '==', emailLower)
      .where('addressNormalized', '==', addressNormalized)
      .where('status', 'in', OPEN_STATUSES)
      .where('createdAt', '>', cutoffIso)
      .limit(1)
      .get();

    if (!existing.empty) {
      const doc = existing.docs[0]!;
      const patch: Record<string, unknown> = { updatedAt: nowIso };
      if (data.message) patch.message = data.message;
      if (data.preferredDate) patch.preferredDate = data.preferredDate;
      if (data.preferredTime) patch.preferredTime = data.preferredTime;

      await doc.ref.update(patch);
      return NextResponse.json(
        { leadId: doc.id, deduped: true },
        { status: 200 },
      );
    }

    const newDoc = leadsCol.doc();
    const payload: Record<string, unknown> = {
      clientName: data.name,
      address: data.address,
      email: data.email,
      emailLower,
      addressNormalized,
      requestedService: data.serviceType,
      status: 'new' satisfies LeadStatus,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    if (data.phone) payload.phone = data.phone;
    if (data.preferredDate) payload.preferredDate = data.preferredDate;
    if (data.preferredTime) payload.preferredTime = data.preferredTime;
    if (data.message) payload.message = data.message;

    await newDoc.set(payload);
    return NextResponse.json(
      { leadId: newDoc.id, deduped: false },
      { status: 201 },
    );
  } catch (err) {
    console.error('[/api/leads] Firestore error', err);
    return NextResponse.json(
      { error: 'Failed to persist lead' },
      { status: 500 },
    );
  }
}

export async function GET(): Promise<Response> {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 },
  );
}
