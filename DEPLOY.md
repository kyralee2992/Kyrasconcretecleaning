# Deploy checklist

This file documents the one-time setup and the repeatable deploy for the
kyralee autonomous-quoting-engine backend. It covers two surfaces:

1. **Vercel** — hosts the Next.js site (marketing + `/api/leads` route handler).
2. **Firebase** — hosts Cloud Functions (`healthCheck`, `onLeadCreated`,
   `onLeadEnriched`) and the shared Firestore database inside the
   `snapbid-eb2c8` project.

Frontend auto-deploys on every push to `main` via the Vercel GitHub
integration. Functions deploy only when you run the script below.

---

## One-time setup

### 1. Firebase — Blaze plan

The `onLeadCreated` trigger calls external HTTP APIs (Nominatim, Marion
County GIS). The `onLeadEnriched` trigger calls Anthropic. External HTTP
calls from Cloud Functions require the **Blaze (pay-as-you-go) plan**.
Spark (free) will reject the deploy.

- Firebase Console → `snapbid-eb2c8` → Upgrade → **Blaze**.
- Set a billing alert / budget cap (recommended $10/month — our volume is
  ~10 leads/day and each enrichment is a handful of small HTTP calls plus
  a few Firestore reads/writes).

### 2. Firebase — service account for Vercel

The Next.js route handler at `/api/leads` uses the Firebase Admin SDK to
write leads into Firestore. It needs a service account credential.

- Firebase Console → `snapbid-eb2c8` → Project Settings → **Service
  Accounts** → *Generate new private key*. Save the downloaded JSON.
- Base64-encode it (single line):

  ```sh
  base64 < path/to/downloaded-key.json | tr -d '\n'
  ```

- Paste the result into Vercel → Project → Settings → **Environment
  Variables** as `FIREBASE_SERVICE_ACCOUNT_B64`, enabled for
  **Production, Preview, Development**.
- Also drop it into local `.env.local` so the route handler works when
  you run `npm run dev`.

Never commit this value.

### 2b. Firebase — Anthropic API key (Secret Manager)

The `onLeadEnriched` trigger calls Anthropic (Claude Sonnet 4.6) to
draft quotes. We use Firebase Secret Manager rather than a plain env
var — rotatable, audited, and never exposed to client-side code.

```sh
# Set the secret once (CLI will prompt for the value). Rotate by
# re-running the same command with a new value.
firebase functions:secrets:set ANTHROPIC_API_KEY --project snapbid-eb2c8

# Verify:
firebase functions:secrets:access ANTHROPIC_API_KEY --project snapbid-eb2c8
```

The trigger declares `secrets: [ANTHROPIC_API_KEY]` in code, so the next
`firebase deploy --only functions` will bind the secret at runtime.
Local emulator runs don't need the secret (tests mock the Anthropic
client).

### 3. Firestore — composite index for the dedupe query

`/api/leads` runs a dedupe query over `{emailLower, addressNormalized,
status, createdAt}`. Firestore refuses to execute this without a
composite index.

Three ways to create it — pick one:

- **Easiest**: submit the form once on a deployed Preview URL. The route
  will fail with a Firestore error containing a console link that
  creates the index in one click.
- **Manual**: Firebase Console → Firestore → Indexes → Create composite,
  using the shape in [`firestore.indexes.json`](./firestore.indexes.json).
- **CLI (isolated from snapbid)**:

  ```sh
  # Uses a throwaway config so snapbid's console-managed indexes are untouched.
  firebase deploy --only firestore:indexes \
    --project snapbid-eb2c8 \
    --config <(jq -n '{firestore:{indexes:"firestore.indexes.json"}}')
  ```

Do **not** wire `firestore.indexes.json` into the repo's `firebase.json`
— that would put this repo in charge of snapbid's whole Firestore
index set.

### 4. CLIs

```sh
npm i -g firebase-tools
firebase login
# optional but recommended for env var sync and local parity:
npm i -g vercel
vercel login
vercel link        # link this repo to the Vercel project
vercel env pull    # populate .env.local from Vercel
```

---

## Repeatable deploy

Once the above is done, every backend deploy is one command:

```sh
./scripts/deploy-functions.sh
```

What it does:

- Verifies the `firebase` CLI is installed.
- Reads the project id from `.firebaserc` and aborts if it's the
  sentinel placeholder.
- Prompts for confirmation (shows project + function names).
- Runs `firebase deploy --only functions`, which invokes the
  `predeploy` hooks in `firebase.json`:
  1. Build `packages/shared-core` → `dist/`
  2. Build `apps/functions` → `lib/`
- Prints post-deploy smoke-test commands.

### Smoke test after deploy

```sh
# HTTP healthCheck
curl "https://us-central1-snapbid-eb2c8.cloudfunctions.net/healthCheck"

# End-to-end trigger chain — seed a doc from the Firebase console at
#   leads/test-smoke
# with fields { status: "new", address: "900 Court St NE, Salem, OR",
#               clientName: "Smoke", email: "smoke@example.com",
#               requestedService: "Deep Cleaning (Concrete)",
#               createdAt: "<now ISO>", updatedAt: "<now ISO>" }
#
# Expected sequence within ~60 s:
#   1. onLeadCreated fires: status new → enriching → enriched
#      (with enrichment.geocode + enrichment.parcel)
#   2. onLeadEnriched fires: status enriched → drafting → drafted
#      (quoteId populated, new doc at quotes/<id>)
#
# Tail both triggers' logs live:
firebase functions:log --only onLeadCreated,onLeadEnriched --follow
```

---

## Rollback

Functions:
```sh
firebase functions:list --project snapbid-eb2c8
firebase functions:delete onLeadCreated --project snapbid-eb2c8    # if needed
firebase functions:delete onLeadEnriched --project snapbid-eb2c8   # if needed
```

A previous revision can be rolled back from the Firebase console
(Functions → select function → Versions). Firebase keeps the last few
deploys.

Vercel: use the Deployments tab → "Promote to Production" on a prior
build.

---

## Current deploy state

As of the 2d PR merging, none of the three functions (`healthCheck`,
`onLeadCreated`, `onLeadEnriched`) have been deployed yet. The code is
merge-ready; deploy is an owner-triggered action. When you are ready,
run the script above.
