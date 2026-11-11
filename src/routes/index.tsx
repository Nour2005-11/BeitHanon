import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Image, Search, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { MartyrCard } from "@/components/MartyrCard";
import { getArchiveStats, getFeaturedMartyrs, hasArchiveConnection } from "@/data/martyrRepository";
import { usePrefs } from "@/lib/prefs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ذاكرة بيت حانون | Memory of Beit Hanoun" },
      {
        name: "description",
        content: "A bilingual memorial archive preserving the names of Beit Hanoun’s martyrs.",
      },
      { property: "og:title", content: "ذاكرة بيت حانون | Memory of Beit Hanoun" },
    ],
  }),
  component: Home,
});

function Home() {
  const { t } = usePrefs();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const connected = hasArchiveConnection();
  const stats = useQuery({
    queryKey: ["archive-stats"],
    queryFn: getArchiveStats,
    enabled: connected,
    staleTime: 60_000,
  });
  const featured = useQuery({
    queryKey: ["featured-martyrs"],
    queryFn: () => getFeaturedMartyrs(3),
    enabled: connected,
    staleTime: 60_000,
  });
  const statisticCards = stats.data
    ? [
        {
          label: t.totalRecords,
          value: stats.data.total,
          icon: BookOpen,
          accent: "stat-card-green",
        },
        {
          label: t.recordsWithPhotos,
          value: stats.data.withPhotos,
          icon: Image,
          accent: "stat-card-blue",
        },
        {
          label: t.datesForReview,
          value: stats.data.datesForReview,
          icon: ShieldCheck,
          accent: "stat-card-amber",
        },
      ]
    : [];

  return (
    <>
      <section className="memorial-hero overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:py-28">
          <div>
            <p className="hero-kicker">{t.heroEyebrow}</p>
            <h1 className="mt-5 max-w-3xl font-heading text-5xl font-extrabold leading-[1.18] text-ivory sm:text-6xl lg:text-7xl">
              {t.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/85">{t.heroText}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/archive"
                search={{ q: "", page: 1 }}
                className="inline-flex items-center gap-2 rounded-full bg-ivory px-6 py-3.5 font-bold text-brand-deep transition-transform hover:-translate-y-0.5"
              >
                {t.exploreArchive}
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/suggest"
                search={{ martyrId: "" }}
                className="inline-flex items-center gap-2 rounded-full border border-ivory/40 px-6 py-3.5 font-bold text-ivory transition-colors hover:bg-ivory/10"
              >
                {t.suggestMartyr}
              </Link>
            </div>
            <form
              className="mt-9 flex max-w-xl overflow-hidden rounded-2xl border border-ivory/20 bg-ivory/10 p-1 backdrop-blur"
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                navigate({ to: "/archive", search: { q: query, page: 1 } });
              }}
            >
              <label className="sr-only" htmlFor="home-search">
                {t.searchQuick}
              </label>
              <input
                id="home-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-ivory placeholder:text-ivory/60 outline-none"
              />
              <button
                type="submit"
                className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-brand-deep"
                aria-label={t.searchGo}
              >
                <Search className="h-5 w-5" aria-hidden="true" />
              </button>
            </form>
          </div>
          <div className="relative mx-auto hidden w-full max-w-sm lg:block">
            <div className="hero-orbit absolute -inset-10 rounded-full" />
            <div className="relative grid aspect-square place-items-center rounded-full border border-ivory/20 bg-ivory/10 p-10 backdrop-blur">
              <BrandMark className="h-48 w-48" />
              <p className="absolute bottom-12 max-w-56 text-center font-heading text-sm leading-relaxed text-ivory/80">
                {t.remembrance}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {stats.isLoading ? (
            <p className="md:col-span-3 text-center text-muted-foreground">{t.loadingStats}</p>
          ) : null}
          {stats.isError || !connected ? (
            <p className="md:col-span-3 rounded-2xl border border-border bg-card p-5 text-center text-sm text-muted-foreground">
              {connected ? t.dataError : t.configError}
            </p>
          ) : null}
          {statisticCards.map((item) => (
            <div
              key={item.label}
              className={`stat-card ${item.accent} rounded-2xl border border-border bg-card p-6 shadow-card`}
            >
              <item.icon className="stat-icon h-6 w-6" aria-hidden="true" />
              <p className="stat-number mt-5 font-heading text-4xl font-extrabold">
                {item.value.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="rounded-[2rem] border border-brand/15 bg-secondary/70 px-6 py-10 text-center sm:px-12">
          <p className="text-xs font-bold tracking-[0.16em] text-brand">{t.prayerTitle}</p>
          <p className="mx-auto mt-5 max-w-4xl font-heading text-xl font-bold leading-loose text-foreground">
            {t.prayer}
          </p>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {t.remembrance}
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-brand">{t.archiveLabel}</p>
            <h2 className="mt-2 font-heading text-3xl font-extrabold text-foreground">
              {t.featuredTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">{t.featuredText}</p>
          </div>
          <Link
            to="/archive"
            search={{ q: "", page: 1 }}
            className="text-sm font-bold text-brand underline decoration-brand/35 decoration-2 underline-offset-4"
          >
            {t.exploreArchive}
          </Link>
        </div>
        {featured.isLoading ? <p className="mt-8 text-muted-foreground">{t.loading}</p> : null}
        {featured.isError ? (
          <button
            type="button"
            onClick={() => featured.refetch()}
            className="mt-8 rounded-full border border-brand px-5 py-2.5 text-sm font-bold text-brand"
          >
            {t.retry}
          </button>
        ) : null}
        {featured.data ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.data.map((record) => (
              <MartyrCard key={record.id} record={record} t={t} />
            ))}
          </div>
        ) : null}
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-5 rounded-[2rem] bg-brand-deep px-7 py-9 text-ivory md:flex-row md:items-center">
          <div>
            <h2 className="font-heading text-2xl font-extrabold">{t.contributionTitle}</h2>
            <p className="mt-2 max-w-2xl leading-relaxed text-ivory/75">{t.contributionText}</p>
          </div>
          <Link
            to="/suggest"
            search={{ martyrId: "" }}
            className="shrink-0 rounded-full bg-accent px-5 py-3 text-sm font-bold text-brand-deep"
          >
            {t.contributionAction}
          </Link>
        </div>
      </section>
    </>
  );
}
