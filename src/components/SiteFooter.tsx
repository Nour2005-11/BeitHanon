import { usePrefs } from "@/lib/prefs";
import { BrandMark } from "./BrandMark";

export function SiteFooter() {
  const { t } = usePrefs();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border bg-secondary/50">
      <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-10 sm:px-6">
        <BrandMark className="h-10 w-10 shrink-0" />
        <div>
          <p className="font-heading text-lg font-extrabold text-foreground">{t.siteName}</p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {t.footerRights(year)}
          </p>
          <p className="mt-2 text-sm font-semibold text-brand">{t.footerBy}</p>
        </div>
      </div>
    </footer>
  );
}
