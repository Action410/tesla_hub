# Genius Data Hub

A mobile-first storefront for data bundles (MTN, Telecel, AirtelTigo, AFA) with no-expiry bundles, Paystack checkout, and optional data supplier API integration.

## Features

- Store home with category cards (MTN, Telecel, AT, AFA Bundle)
- Bundle list per network with **No Expiry** badges
- Cart and Paystack checkout (Ghana Cedis)
- On payment success: order saved and optional supplier API call (buy-data)
- Success page with order reference and **No Expiry** confirmation
- Floating WhatsApp support button
- Admin view of bundles and expiry flag

## Environment variables

Create a `.env.local` in the project root (and set these in Vercel for production):

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack public key (required for payments) |
| `PAYSTACK_SECRET_KEY` | Optional; for server-side payment verification |
| `DATA_SUPPLIER_API_URL` | Optional; data supplier API base URL (e.g. RemaData/DataPlug) |
| `DATA_SUPPLIER_API_KEY` | Optional; API key for supplier |
| `NEXT_PUBLIC_WHATSAPP_LINK` | Optional; WhatsApp chat link (e.g. `https://wa.me/233...`) |
| `NEXT_PUBLIC_JOIN_CHANNEL_URL` | Optional; Join Channel button URL (e.g. Telegram) |
| `NEXT_PUBLIC_CONTACT_URL` | Optional; Contact button URL (e.g. `mailto:...`) |

## Bundles and expiry flag

- Bundle data lives in **`data/bundles.json`**.
- Each bundle has: `id`, `network`, `title`, `sizeMB` (optional), `price`, `badge`, **`expires`** (boolean), **`expiry_note`** (e.g. `"No expiry"`), `description`.
- **Default for all bundles:** set `expires: false` and `expiry_note: "No expiry"`.
- To add or edit bundles: update `data/bundles.json`, then redeploy.
- To change the expiry flag: set `expires: true` and adjust `expiry_note` in the JSON for that bundle; redeploy.
- The **Admin** page (`/dashboard/admin`) lists all bundles and their current `expires` value (read-only; edits are done in the JSON file).

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env.local` (or create `.env.local`) and set at least:
```bash
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxx
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000). The store home shows category cards; click a category to see bundles.

## Deployment (Vercel)

1. Push your code to GitHub and import the repo in Vercel.
2. Add the environment variables in Vercel: **Project → Settings → Environment Variables**.
3. Build command: `npm run build` (default). Deploy.
4. **Note:** `data/bundles.json` and `data/orders.json` are read/written at build and runtime. On Vercel, serverless functions have an ephemeral filesystem; for production you may want to replace file-based storage with a database or Vercel KV/Postgres for orders and, if needed, bundles.

## Tech stack

- Next.js 14, React 18, Tailwind CSS, Framer Motion
- Paystack (GHS)
- Optional: external data supplier API for auto-issuing bundles after payment
