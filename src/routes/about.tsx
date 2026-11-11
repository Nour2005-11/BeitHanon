import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, MapPin, ScrollText } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { CityBeforeAfter } from "@/components/CityBeforeAfter";
import { usePrefs } from "@/lib/prefs";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "عن بيت حانون | About Beit Hanoun" },
      {
        name: "description",
        content:
          "Sourced context and geographic references for Beit Hanoun in the northern Gaza Strip.",
      },
      { property: "og:title", content: "عن بيت حانون | About Beit Hanoun" },
    ],
  }),
  component: About,
});

function About() {
  const { t } = usePrefs();
  const sections = [
    { title: t.aboutLocationTitle, text: t.aboutLocation, icon: MapPin },
    { title: t.aboutLandTitle, text: t.aboutLand, icon: BrandMark },
    { title: t.aboutMemoryTitle, text: t.aboutMemory, icon: ScrollText },
  ];
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <header className="mx-auto max-w-3xl text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary">
            <BrandMark className="h-12 w-12" />
          </div>
          <p className="mt-5 text-xs font-bold tracking-[0.16em] text-brand">بيت حانون</p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold text-foreground sm:text-5xl">
            {t.aboutTitle}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{t.aboutLead}</p>
        </header>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-[1.6rem] border border-border bg-card p-7 shadow-card"
            >
              <section.icon className="h-8 w-8 text-brand" aria-hidden="true" />
              <h2 className="mt-6 font-heading text-2xl font-extrabold text-foreground">
                {section.title}
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{section.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 grid gap-7 lg:grid-cols-[1.2fr_.8fr]">
          <section className="overflow-hidden rounded-[1.7rem] border border-border bg-card p-2 shadow-card">
            <iframe
              title={t.mapFrame}
              src="https://maps.google.com/maps?q=31.538483,34.53677&z=13&output=embed"
              loading="lazy"
              className="aspect-[16/10] w-full rounded-[1.3rem]"
            />
            <div className="flex flex-wrap items-center justify-between gap-4 p-5">
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">{t.mapNote}</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Beit+Hanoun%2C+Gaza%2C+Palestine"
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-brand px-4 py-2.5 text-sm font-bold text-brand hover:bg-secondary"
              >
                {t.mapOpen}
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </section>
          <aside className="grid gap-4">
            <figure className="overflow-hidden rounded-[1.7rem] border border-border bg-card shadow-card">
              <img
                src="/beit-hanoun-gate.jpg"
                alt="بوابة مدينة بيت حانون"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              <figcaption className="p-4 text-sm font-bold text-foreground">
                بوابة بيت حانون
              </figcaption>
            </figure>
            <figure className="overflow-hidden rounded-[1.7rem] border border-border bg-card shadow-card">
              <img
                src="/beit-hanoun-fields.jpg"
                alt="الأراضي الزراعية في بيت حانون"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              <figcaption className="p-4 text-sm font-bold text-foreground">
                أرضها وذاكرتها الزراعية
              </figcaption>
            </figure>
            <figure className="overflow-hidden rounded-[1.7rem] border border-border bg-card shadow-card">
              <img
                src="/beit-hanoun-sunset.jpg"
                alt="حقول بيت حانون وقت الغروب"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              <figcaption className="p-4 text-sm font-bold text-foreground">
                من ذاكرة الأرض
              </figcaption>
            </figure>
          </aside>
        </div>
      </section>
      <CityBeforeAfter t={t} />
    </>
  );
}
