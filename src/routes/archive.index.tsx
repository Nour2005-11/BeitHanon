import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useDeferredValue, useEffect, useState } from "react";
import { MartyrCard } from "@/components/MartyrCard";
import { getArchivePage, hasArchiveConnection } from "@/data/martyrRepository";
import { usePrefs } from "@/lib/prefs";

const PAGE_SIZE = 24;

export const Route = createFileRoute("/archive/")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
    page: typeof search["page"] === "number" && search["page"] > 0 ? Math.floor(search["page"]) : 1,
  }),
  head: () => ({
    meta: [
      { title: "سجل الشهداء | Martyrs Archive" },
      {
        name: "description",
        content:
          "Search the published memorial archive of Beit Hanoun’s martyrs in Arabic and English.",
      },
      { property: "og:title", content: "سجل الشهداء | Martyrs Archive" },
    ],
  }),
  component: Archive,
});

function Archive() {
  const { t } = usePrefs();
  const navigate = useNavigate({ from: "/archive" });
  const { q, page } = Route.useSearch();
  const [queryInput, setQueryInput] = useState(q);
  const deferredQuery = useDeferredValue(queryInput);
  const connected = hasArchiveConnection();
  const archive = useQuery({
    queryKey: ["archive", page, deferredQuery],
    queryFn: () => getArchivePage({ page, pageSize: PAGE_SIZE, query: deferredQuery }),
    enabled: connected,
    placeholderData: (previous) => previous,
  });
  const totalPages = archive.data ? Math.max(1, Math.ceil(archive.data.total / PAGE_SIZE)) : 1;

  useEffect(() => setQueryInput(q), [q]);

  function update(next: { q?: string; page?: number }) {
    navigate({
      search: { q: next.q ?? queryInput, page: next.page ?? 1 },
      replace: true,
    });
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold tracking-[0.16em] text-brand">{t.archiveLabel}</p>
        <h1 className="mt-3 font-heading text-4xl font-extrabold text-foreground sm:text-5xl">
          {t.archiveTitle}
        </h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">{t.archiveIntro}</p>
      </header>
      <div className="mx-auto mt-10 max-w-4xl rounded-[1.6rem] border border-border bg-card p-4 shadow-card">
        <form
          className="flex flex-col gap-3 sm:flex-row"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            update({ q: queryInput, page: 1 });
          }}
        >
          <label className="relative block min-w-0 flex-1">
            <span className="sr-only">{t.searchQuick}</span>
            <Search
              className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand"
              aria-hidden="true"
            />
            <input
              type="search"
              value={queryInput}
              onChange={(event) => setQueryInput(event.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full rounded-xl border border-border bg-background py-3 pe-4 ps-12 text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <button
            type="submit"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 font-bold text-brand-foreground transition-colors hover:bg-brand-deep"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            {t.searchGo}
          </button>
        </form>
        {q ? (
          <button
            type="button"
            onClick={() => {
              setQueryInput("");
              update({ q: "", page: 1 });
            }}
            className="mt-3 text-sm font-bold text-brand underline decoration-brand/35 underline-offset-4"
          >
            {t.clearFilters}
          </button>
        ) : null}
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground" aria-live="polite">
        {archive.data ? t.results(archive.data.records.length, archive.data.total) : t.loading}
      </p>
      {!connected ? (
        <p className="mt-8 rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          {t.configError}
        </p>
      ) : null}
      {archive.isLoading ? (
        <p className="mt-8 text-center text-muted-foreground">{t.loading}</p>
      ) : null}
      {archive.isError ? (
        <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">{t.dataError}</p>
          <button
            type="button"
            onClick={() => archive.refetch()}
            className="mt-4 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground"
          >
            {t.retry}
          </button>
        </div>
      ) : null}
      {archive.data?.records.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          {t.noResults}
        </p>
      ) : null}
      {archive.data?.records.length ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {archive.data.records.map((record) => (
            <MartyrCard key={record.id} record={record} t={t} />
          ))}
        </div>
      ) : null}
      {archive.data && archive.data.total > PAGE_SIZE ? (
        <nav
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
          aria-label={t.archivePagination}
        >
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => update({ page: page - 1 })}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-bold text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t.previous}
          </button>
          <span className="text-sm text-muted-foreground">{t.page(page, totalPages)}</span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => update({ page: page + 1 })}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-bold text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t.next}
          </button>
        </nav>
      ) : null}
    </section>
  );
}
