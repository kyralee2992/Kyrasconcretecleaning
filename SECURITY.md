# Security Policy

## Supported Versions

This is a static business website with no versioned releases. Security fixes are applied to the latest commit on the `main` branch and deployed immediately.

| Branch | Receives Security Fixes |
|--------|------------------------|
| `main` | ✅ Yes                 |
| Any other branch | ❌ No           |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please **do not open a public GitHub issue**. Instead, report it privately so it can be addressed before public disclosure.

**Contact:** kyraleecleaning@gmail.com
**Subject line:** `[SECURITY] <brief description>`

**Expected response time:** Within 5 business days.

**What to include:**
- A clear description of the vulnerability and its potential impact
- Steps to reproduce (proof-of-concept if applicable)
- Any suggested remediation

**What you can expect:**
- Confirmation of receipt within 5 business days
- An assessment of severity and a timeline for a fix
- Credit in the commit message if you wish (or anonymous, your choice)

## Security Hardening

The following protections were applied during a TDD security audit (2026-03-25):

### HTTP Security Headers (all routes)
Set via `next.config.ts` `headers()` and verified by the automated test suite:

| Header | Value |
|--------|-------|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Content-Security-Policy` | See below |

### Content Security Policy
```
default-src 'self'
script-src 'self' 'unsafe-inline'   ← known Next.js limitation (hydration)
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
font-src 'self' https://fonts.gstatic.com data:
img-src 'self' data: https:
connect-src 'self' https://api.web3forms.com
frame-src 'none'
frame-ancestors 'none'              ← blocks clickjacking
object-src 'none'                   ← blocks Flash/plugin injection
base-uri 'self'                     ← blocks base-tag hijacking
form-action 'self' https://api.web3forms.com
```

> **Note on `'unsafe-inline'`:** Next.js injects inline scripts during server-side rendering and hydration. Removing `'unsafe-inline'` requires nonce-based CSP which is not yet implemented. This is a known framework limitation documented in the test suite.

### Contact Form Protection
- **Client-side rate limiting:** 3-second cooldown between submissions (`lastSubmitRef`)
- **Fetch timeout:** AbortController with 10-second timeout
- **Input validation:** Name, email (format + custom regex), phone (≥10 digits), service type — all required
- **HTTP status check:** Non-2xx responses surface an error regardless of response body
- **No server-side API routes:** Form data is submitted directly to [Web3Forms](https://web3forms.com/) — no PII stored in this application

### Dependency Policy
- Dependencies are pinned to specific versions in `package.json`
- Run `npm audit` before deploying to check for known CVEs
