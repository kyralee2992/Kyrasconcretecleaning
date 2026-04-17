import {
  cert,
  getApps,
  initializeApp,
  type App,
  type ServiceAccount,
} from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

const APP_NAME = 'kyralee-web';

function loadServiceAccount(): ServiceAccount {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (!b64) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_B64 is not set. ' +
        'Populate it in Vercel env (all environments) and in local .env.local.',
    );
  }

  const json = Buffer.from(b64, 'base64').toString('utf8');
  const parsed = JSON.parse(json) as Record<string, unknown>;

  return {
    projectId: parsed.project_id as string,
    clientEmail: parsed.client_email as string,
    privateKey: parsed.private_key as string,
  };
}

function ensureApp(): App {
  const existing = getApps().find((app) => app.name === APP_NAME);
  if (existing) return existing;

  return initializeApp(
    {
      credential: cert(loadServiceAccount()),
    },
    APP_NAME,
  );
}

let cachedDb: Firestore | null = null;

export function adminDb(): Firestore {
  if (cachedDb) return cachedDb;
  cachedDb = getFirestore(ensureApp());
  return cachedDb;
}
