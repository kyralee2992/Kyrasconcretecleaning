# Kyra Lee's Concrete Cleaning

Business website for Kyra Lee's Concrete Cleaning — a pressure washing and soft washing service based in Salem, Oregon.

## Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS v4
- **Deployment**: Vercel (recommended)
- **Contact form**: Web3Forms

## Getting started

```bash
npm install
npm run dev
```

## Environment variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Web3Forms access key — get one free at [web3forms.com](https://web3forms.com) |

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, services, how it works, about, FAQ, pricing, contact |
| `/services/soft-washing-siding` | Soft washing service detail |
| `/services/deep-cleaning-concrete` | Concrete deep cleaning service detail |
| `/thank-you` | Post-form submission confirmation |
| `/privacy-policy` | Privacy policy |
| `/terms-of-service` | Terms of service |

## Deployment

Push to GitHub and connect the repo to [Vercel](https://vercel.com). Add `NEXT_PUBLIC_WEB3FORMS_KEY` in the Vercel project environment variables dashboard before deploying.
