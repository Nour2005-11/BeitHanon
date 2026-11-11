# Memory of Beit Hanoun — Stage 2 To Do

- [x] **Read-only Supabase discovery and configuration**
  - Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` through protected project environment settings only; never commit, log, or hardcode credentials.
  - Inspect the accessible `martyrs`, `martyr_photos`, `admin_users`, `martyr_suggestions`, and `photo_suggestions` structures with read-only requests only, then map the public UI to verified columns and approved image URLs.
  - Do not import, insert, update, delete, truncate, reset, recreate, or bulk-overwrite records; do not change schema, RLS, Storage policies, buckets, authentication, permissions, or deployment settings.
  - Verify the numeric/stable route identifier from the live records rather than assuming the ZIP’s local `BH-####` convention is a database mapping.

- [x] **Arabic-first responsive memorial shell**
  - Deliver Arabic/English switching with correct RTL/LTR direction, language-appropriate Cairo/Tajawal typography, light/dark theme controls, keyboard navigation, clear focus states, and responsive header/footer navigation.
  - Use a restrained, respectful memorial identity with warm ivory/beige surfaces, muted olive accents, a near-black dark theme, an original olive-branch/land SVG mark, and no purple, neon, flashy gradients, or excessive animation.
  - Keep markup, styles, and TypeScript behavior in separate files, use reusable components, typed models, centralized environment configuration, and accessible text alternatives.

- [x] **Public data-driven home and archive**
  - Build a home page with memorial introduction, non-hardcoded database-driven headline statistics, search entry point, featured available records, prayer/remembrance, loading/error/empty states, and clear archive/contribution navigation.
  - Build a paginated read-only archive from Supabase with Arabic/English name search, supported date filtering, result counts, incremental loading or pagination, loading/error/empty/retry states, and responsive cards.
  - Preserve every approved photograph’s complete proportions with `object-fit: contain`; show a local olive-branch placeholder when an approved image is absent or fails to load.

- [x] **Verified record details and sourced context**
  - Build dedicated martyr detail routes using a live verified ID or stable identifier, displaying only actual available names, dates, source information, and approved image fields.
  - Build an About Beit Hanoun page with careful original wording, visible source attribution, a mobile-safe map and Google Maps link, and no invented facts or statistics.

- [x] **Contribution and administration safety boundary**
  - Provide a clear contribution interface that explains review requirements but performs no write in Stage 2 until the pending-submission schema and policies are verified.
  - Plan the admin dashboard without creating accounts, bypassing authentication, weakening RLS, or exposing any administrative data or action.
  - Inspect upload-related behavior before enabling photo suggestions; never use the public `martyr-photos` bucket for unreviewed submissions or publish a suggestion automatically.

- [x] **Project documentation and verification**
  - Include a setup/deployment README and `.env.example` without secret values, plus `manus-routes.json`, favicon, metadata, sitemap, and robots guidance appropriate to the public routes.
  - Run TypeScript diagnostics, linting, tests, and a production build; report the exact verified integration status, permissions limitations, changed files, and remaining pre-deployment steps.
