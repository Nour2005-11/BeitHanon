# ذاكرة بيت حانون | Memory of Beit Hanoun

An Arabic-first public memorial archive for the people of Beit Hanoun. The application is built with TanStack Start, React, TypeScript, Tailwind CSS, and a browser-safe Supabase client.

## Stage 2 scope

This version reads only the existing Supabase archive. It contains no database write, deletion, upload, approval, authentication, or administrative mutation. It does not use the legacy ZIP JSON or its local martyr photos as a production data source.

The verified public `martyrs` fields used by the application are `id`, `name_ar`, `name_en`, `birth_date`, `martyrdom_date`, `image_url`, `source`, `source_row`, `martyrdom_date_raw`, and `date_status`. Public detail routes use the verified numeric `id`. A `BH-####` reference is displayed only for the currently verified 1–756 range, whose record ordering was confirmed against the supplied reference archive by matching Arabic and English names.

The live read-only inspection found 756 public martyr records, 238 non-null approved `image_url` values, 733 non-null martyrdom dates, and 23 records marked with `date_status = review`. The `martyr_suggestions` and `photo_suggestions` tables deny anonymous reads, as they should. No submission action is enabled until the pending workflow and private photo-upload policy can be reviewed safely.

## Environment configuration

Configure these variables through the managed project environment settings, not in source files:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Use a publishable/anon key only. Never use a service-role or secret key in a browser bundle. The provided `.env.example` contains names only.

## Local commands

```bash
npm install --legacy-peer-deps --no-audit --no-fund
npm run dev
npm run lint
npm run test
npm run build
```

The source dependency graph requires npm’s legacy peer resolver in this environment. This does not change the application’s data-access policy.

## Architecture

- `src/data/` holds typed, centralized, read-only Supabase access and Arabic search normalization.
- `src/routes/` holds the homepage, archive, numeric detail route, About page, and non-writing contribution page.
- `src/components/` holds reusable shell, logo, image-fallback, and record-card UI.
- `src/styles.css` contains the shared olive/ivory design tokens and dark-mode system.
- `public/manus-routes.json` declares all public application routes.
- `docs/about-sources.md` records the sources linked from the About page.

## Before enabling contributions, administration, or deployment

Do not enable public submission, photo upload, admin login, review/approval actions, or any policy/schema change until the current tables, RLS policies, and private quarantine upload path are inspected and explicitly approved. Deployment configuration is intentionally deferred until the user approves it and provides the intended public domain, which is needed for canonical metadata and a production sitemap.

## Enabling contributions (manual step required)

The contribution UI writes only to the separate `martyr_contributions` and `photo_contributions` pending queues. It does not write to or update `martyrs`. Before publishing these code changes, open `supabase/contributions_setup.sql`, review it, and run it in the Supabase SQL Editor. It creates separate submission tables and a private `pending-martyr-photos` bucket with upload-only public permissions. There is intentionally no public read or approval permission. Review pending rows in the Supabase dashboard; do not approve by changing the main `martyrs` table from the public site.

The unified contribution form accepts either a new martyr entry with an optional photo or an existing record reference (`BH-####` or the numeric ID). When an existing record is entered, only the photo and the single notes field are shown; the existing record's name and date are not repeated. Date input accepts common day-month-year separators (`-`, `/`, or `.`), eight digits (`DDMMYYYY`), or ISO input; a valid date is normalized to `DD-MM-YYYY` in the field and converted to ISO (`YYYY-MM-DD`) for storage. Photo uploads remain limited client-side to 8 MB and JPEG/PNG/WebP. The existing pending queues, upload bucket, and database policies are unchanged.

The admin review page shows pending photos using short-lived signed preview URLs. The pending-photo bucket stays private; previews require the admin-only storage read policy in `supabase/admin_dashboard_setup.sql` to have been applied. Approvals and rejections continue through the existing admin actions.
