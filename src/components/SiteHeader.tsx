import { Link } from "@tanstack/react-router";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { usePrefs } from "@/lib/prefs";
import { BrandLockup } from "./BrandMark";

export function SiteHeader() {
  const { t, lang, setLang, theme, toggleTheme } = usePrefs();
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/" as const, label: t.nav.home },
    { to: "/archive" as const, label: t.nav.archive },
    { to: "/about" as const, label: t.nav.about },
    { to: "/suggest" as const, label: t.nav.contribute },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" aria-label={t.siteName} onClick={() => setOpen(false)}>
          <BrandLockup name={t.siteName} subtitle={t.siteSubtitle} />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label={t.primaryNavigation}>
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-full px-4 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{
                className: "rounded-full bg-secondary px-4 py-2 text-sm font-bold text-brand",
              }}
              activeOptions={{ exact: link.to === "/" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="min-w-16 rounded-full border border-border bg-card px-3 py-2 text-xs font-extrabold text-brand transition-colors hover:bg-secondary"
            aria-label={lang === "ar" ? t.switchToEnglish : t.switchToArabic}
            title={lang === "ar" ? t.switchToEnglish : t.switchToArabic}
          >
            {lang === "ar" ? t.switchToEnglish : t.switchToArabic}
          </button>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-brand transition-colors hover:bg-secondary"
              aria-label={t.toggleTheme}
              title={t.toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-secondary lg:hidden"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? t.closeMenu : t.menu}
              aria-expanded={open}
              aria-controls="mobile-site-menu"
            >
              {open ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      {open ? (
        <div
          id="mobile-site-menu"
          className="border-t border-border bg-background px-4 py-4 lg:hidden"
        >
          <nav className="mx-auto flex max-w-7xl flex-col gap-1" aria-label={t.mobileNavigation}>
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 font-bold text-muted-foreground hover:bg-secondary hover:text-foreground"
                activeProps={{
                  className: "rounded-xl bg-secondary px-4 py-3 font-bold text-brand",
                }}
                activeOptions={{ exact: link.to === "/" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
