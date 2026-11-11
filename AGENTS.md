<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

## Project rules

- Production martyr records are read from the existing Supabase `martyrs` table through `src/data/martyrRepository.ts`. Do not restore or use the standalone `src/data/martyrs.json` file or bundled local martyr photos. The public numeric `id` is the verified detail-route key; `BH-####` is only a derived reference for the verified 1–756 sequence.
- Keep Stage 2 data access read-only. Do not add inserts, updates, deletes, uploads, schema changes, RLS/policy changes, authentication changes, or deployment changes without explicit approval.
- All UI text goes through `src/lib/i18n.ts` (`dict.ar` / `dict.en`) and `usePrefs()`; language/theme are applied pre-paint by `prefsBootScript` to avoid flashes.
