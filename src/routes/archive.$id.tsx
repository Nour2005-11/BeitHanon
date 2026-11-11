import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Tag } from "lucide-react";
import type { ReactNode } from "react";
import { MartyrPhoto } from "@/components/MartyrPhoto";
import { getMartyrById, hasArchiveConnection } from "@/data/martyrRepository";
import { formatDateDayMonthYear, formatMartyrdomDate } from "@/lib/date-format";
import { usePrefs } from "@/lib/prefs";

export const Route = createFileRoute("/archive/$id")({
  head: () => ({
    meta: [
      { title: "سجل شهيد | Martyr Record" },
      { name: "description", content: "Published memorial record from the Beit Hanoun archive." },
    ],
  }),
  component: MartyrDetails,
});

function DetailField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-b border-border py-4 last:border-0">
      <dt className="text-sm font-bold text-brand">{label}</dt>
      <dd className="mt-1.5 text-foreground">{children}</dd>
    </div>
  );
}

function MartyrDetails() {
  const { t } = usePrefs();
  const { id } = Route.useParams();
  const recordId = Number(id);
  const validId = Number.isInteger(recordId) && recordId > 0;
  const record = useQuery({
    queryKey: ["martyr", recordId],
    queryFn: () => getMartyrById(recordId),
    enabled: hasArchiveConnection() && validId,
  });

  if (record.isLoading)
    return (
      <section className="mx-auto max-w-5xl px-4 py-20 text-center text-muted-foreground">
        {t.loadingRecord}
      </section>
    );
  if (!hasArchiveConnection())
    return (
      <section className="mx-auto max-w-5xl px-4 py-20 text-center text-muted-foreground">
        {t.configError}
      </section>
    );
  if (record.isError)
    return (
      <section className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="text-muted-foreground">{t.dataError}</p>
        <button
          type="button"
          onClick={() => record.refetch()}
          className="mt-5 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground"
        >
          {t.retry}
        </button>
      </section>
    );
  if (!record.data)
    return (
      <section className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="text-muted-foreground">{t.recordNotFound}</p>
        <Link
          to="/archive"
          search={{ q: "", page: 1 }}
          className="mt-5 inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground"
        >
          {t.backToArchive}
        </Link>
      </section>
    );

  const martyr = record.data;
  const martyrdomDate = formatMartyrdomDate(martyr.martyrdomDate, martyr.martyrdomDateRaw);
  const birthDate = formatDateDayMonthYear(martyr.birthDate);
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link
        to="/archive"
        search={{ q: "", page: 1 }}
        className="inline-flex items-center gap-2 text-sm font-bold text-brand underline decoration-brand/35 underline-offset-4"
      >
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
        {t.backToArchive}
      </Link>
      <article className="mt-7 overflow-hidden rounded-[2rem] border border-border bg-card shadow-card lg:grid lg:grid-cols-[.85fr_1.15fr]">
        <MartyrPhoto
          src={martyr.imageUrl}
          alt={t.imageOf(martyr.arabicName)}
          placeholderLabel={t.noVerifiedPhoto}
          className="min-h-96 lg:min-h-full"
        />
        <div className="p-7 sm:p-10">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold tracking-[0.14em] text-brand">
            {martyr.legacyReference ? <span>{martyr.legacyReference}</span> : null}
            <span className="h-1 w-1 rounded-full bg-brand/50" /> <span>{t.archiveReference}</span>
          </div>
          <h1
            dir="rtl"
            lang="ar"
            className="mt-5 font-heading text-4xl font-extrabold leading-tight text-foreground"
          >
            {martyr.arabicName}
          </h1>
          {martyr.englishName ? (
            <p dir="ltr" lang="en" className="mt-3 text-lg text-muted-foreground">
              {martyr.englishName}
            </p>
          ) : null}
          <dl className="mt-9">
            <DetailField label={t.martyrdomDate}>
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-brand" aria-hidden="true" />
                {martyrdomDate ? <span dir="ltr">{martyrdomDate}</span> : t.dateUnavailable}
              </span>
              {martyr.dateStatus === "review" ? (
                <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                  {t.dateNeedsReview}
                </p>
              ) : null}
            </DetailField>
            <DetailField label={t.birthDate}>
              {birthDate ? <span dir="ltr">{birthDate}</span> : t.dateUnavailable}
            </DetailField>
          </dl>
          <div className="mt-8 flex items-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
            <Tag className="h-4 w-4 text-brand" aria-hidden="true" />{" "}
            <span>
              {t.archiveReference}: {martyr.legacyReference || martyr.id}
            </span>
          </div>
        </div>
      </article>
    </section>
  );
}
