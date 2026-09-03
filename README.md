# Port-Fresh Frozen Foods — Ecommerce Platform

Order frozen foods sourced from the port, delivered to your door — no more
waking up before dawn to go get it yourself.

This is Phase 1 (MVP) of the build: browsing, cart, checkout, Paystack
payment, order tracking, and an admin dashboard for managing products and
orders. It's built entirely on free tiers.

## Stack
- **Next.js 14** (App Router) — frontend + backend in one project
- **Supabase** — Postgres database, authentication, row-level security
- **Cloudinary** — product image/video hosting (add via admin, see below)
- **Resend** — transactional email
- **Paystack** — payments (GHS)
- **Vercel** — hosting
- SMS is intentionally not wired up yet — see `lib/notifications.ts`, it's a
  drop-in slot for Arkesel/Twilio once you have a paid SMS budget.

## 1. Get this code onto your machine and into GitHub

If you downloaded this as a zip/folder from Claude, unzip it, then:

```bash
cd frozen-foods-ecommerce
git init
git add .
git commit -m "Initial commit: Port-Fresh Frozen Foods MVP"
```

Create a new **empty** repository on GitHub (no README/license — this
project already has one), then:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## 2. Set up Supabase (free)
1. Create a project at https://supabase.com
2. Go to the SQL Editor, paste the contents of `supabase/schema.sql`, and run it.
   This creates every table, security rule, and a starter set of categories.
3. Go to Project Settings → API and copy your `Project URL` and `anon public` key.
4. In Authentication → Providers, make sure Email is enabled.
5. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API → service_role — keep this secret, never expose client-side)

### Make yourself an admin
After you sign up once through the app, run this in Supabase's SQL Editor
(replace with your email):

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```

## 3. Set up Cloudinary (free tier, for product photos/videos)
1. Create an account at https://cloudinary.com
2. Copy your Cloud Name, API Key, and API Secret into `.env.local`
3. For Phase 1, the simplest path is: upload product images/videos directly in
   the Cloudinary dashboard, then paste the resulting URL into the product's
   `image_urls` field via Supabase's Table Editor. (A proper in-admin upload
   button is a good Phase 2 addition.)

## 4. Set up Resend (free tier, for order emails)
1. Create an account at https://resend.com, verify a sending domain (or use
   their test domain while developing)
2. Copy your API key into `.env.local` as `RESEND_API_KEY`

## 5. Set up Paystack (free to integrate, pay-per-transaction)
1. Create an account at https://paystack.com
2. Copy your test Secret Key into `.env.local` as `PAYSTACK_SECRET_KEY`
3. In Paystack dashboard → Settings → API Keys & Webhooks, add a webhook URL:
   `https://YOUR_DOMAIN/api/webhooks/paystack`
   (while developing locally, use a tool like `ngrok` to expose localhost)

## 6. Run it locally
```bash
npm install
npm run dev
```
Visit http://localhost:3000

## 7. Deploy to Vercel (free)
1. Push this repo to GitHub (step 1 above)
2. Go to https://vercel.com → New Project → import your GitHub repo
3. Add all the same environment variables from `.env.local` in Vercel's
   project settings
4. Deploy — Vercel gives you a live URL automatically
5. Update `NEXT_PUBLIC_SITE_URL` in Vercel's env vars to your real deployed URL,
   and update your Paystack webhook URL to match

## Project structure
```
app/                    Pages and API routes (Next.js App Router)
  shop/                 Customer-facing: listing, product, cart, checkout, orders
  admin/                Admin dashboard: manage products & orders
  api/                  Backend routes: orders, Paystack init + webhook
components/             Reusable UI pieces
lib/                    Supabase clients, cart store, notification abstraction
supabase/schema.sql     Full database schema + security rules — run this first
types/                  Shared TypeScript types
```

## What's next (Phase 2/3 — see the original build prompt)
- Delivery time-slot scheduling
- In-admin image/video upload (instead of manual Cloudinary + Supabase paste)
- SMS notifications once there's budget (slot already prepared in `lib/notifications.ts`)
- Product reviews, search/filter, PWA offline support
