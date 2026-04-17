#!/usr/bin/env bash
# Deploy Cloud Functions (healthCheck, onLeadCreated) from apps/functions
# to the Firebase project declared in .firebaserc.
#
# Prerequisites — see DEPLOY.md:
#   - firebase-tools installed and logged in (firebase login)
#   - Blaze plan active on the target Firebase project
#   - .firebaserc default project matches intended target
#
# The predeploy hooks in firebase.json handle building shared-core and
# the functions workspace; this script just wraps the deploy with
# pre-flight checks and an interactive confirmation.

set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

if ! command -v firebase >/dev/null 2>&1; then
  echo "ERROR: firebase CLI not found. Install with: npm i -g firebase-tools" >&2
  exit 1
fi

if [[ ! -f .firebaserc ]]; then
  echo "ERROR: .firebaserc missing at repo root" >&2
  exit 1
fi

PROJECT_ID="$(node -e 'const fs=require("fs");const rc=JSON.parse(fs.readFileSync(".firebaserc","utf8"));console.log(rc.projects && rc.projects.default || "")')"
if [[ -z "$PROJECT_ID" ]]; then
  echo "ERROR: no default project in .firebaserc" >&2
  exit 1
fi

if [[ "$PROJECT_ID" == "REPLACE_WITH_FIREBASE_PROJECT_ID" ]]; then
  echo "ERROR: .firebaserc still holds the sentinel placeholder" >&2
  exit 1
fi

cat <<EOF
About to deploy Cloud Functions.
  Project:    $PROJECT_ID
  Functions:  healthCheck, onLeadCreated, onLeadEnriched
  Source:     apps/functions (Node.js 22)
EOF

read -rp "Continue? (y/N) " confirm
case "$confirm" in
  y|Y|yes|YES) ;;
  *) echo "Aborted."; exit 0 ;;
esac

echo
echo "==> firebase deploy --only functions"
firebase deploy --only functions

echo
echo "Done. Smoke test the HTTP function:"
echo "  curl https://us-central1-${PROJECT_ID}.cloudfunctions.net/healthCheck"
echo
echo "Tail Firestore-trigger logs live:"
echo "  firebase functions:log --only onLeadCreated --follow"
