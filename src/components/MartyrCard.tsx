import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, CalendarDays } from "lucide-react";
import type { MartyrRecord } from "@/data/martyrTypes";
import type { Dict } from "@/lib/i18n";
import { formatMartyrdomDate } from "@/lib/date-format";
import { MartyrPhoto } from "./MartyrPhoto";

type MartyrCardProps = { record: MartyrRecord; t: Dict };

export function MartyrCard({ record, t }: MartyrCardProps) {
  const date = formatMartyrdomDate(record.martyrdomDate, record.martyrdomDateRaw);

  return (
    <article className="group overflow-hidden rounded-[1.35rem] border border-border/90 bg-card shadow-card transition-transform duration-200 hover:-translate-y-1 hover:border-brand/45">
      <MartyrPhoto
        src={record.imageUrl}
        alt={t.imageOf(record.arabicName)}
        placeholderLabel={t.noVerifiedPhoto}
        className="aspect-[4/5] border-b border-border/80"
      />
      <div className="flex min-h-48 flex-col p-5 text-center">
        {record.legacyReference ? (
          <span className="text-xs font-bold tracking-[0.16em] text-brand">
            {record.legacyReference}
          </span>
        ) : null}
        <h3
          dir="rtl"
          lang="ar"
          className="mt-2 font-heading text-lg font-extrabold leading-snug text-card-foreground"
        >
          {record.arabicName}
        </h3>
        {record.englishName ? (
          <p dir="ltr" lang="en" className="mt-1 text-sm leading-snug text-muted-foreground">
            {record.englishName}
          </p>
        ) : null}
        <div className="mt-auto pt-5">
          <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-brand">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {date ? <span dir="ltr">{date}</span> : <span>{t.dateUnavailable}</span>}
          </p>
          <Link
            to="/archive/$id"
            params={{ id: String(record.id) }}
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-foreground underline decoration-brand/50 decoration-2 underline-offset-4 transition-colors hover:text-brand"
          >
            {t.archiveReference} <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
