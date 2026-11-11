import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import appCss from "../styles.css?url";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { PrefsProvider, prefsBootScript } from "@/lib/prefs";

function MessagePage({ title, text }: { title: string; text: string }) {
  return (
    <section className="mx-auto flex min-h-[56vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-bold tracking-[0.18em] text-brand">ذاكرة بيت حانون</p>
      <h1 className="mt-3 font-heading text-3xl font-extrabold text-foreground">{title}</h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">{text}</p>
      <Link
        to="/"
        className="mt-7 rounded-full bg-brand px-5 py-3 text-sm font-bold text-brand-foreground"
      >
        العودة إلى الرئيسية
      </Link>
    </section>
  );
}

function NotFoundComponent() {
  return (
    <MessagePage title="الصفحة غير موجودة" text="قد يكون الرابط غير صحيح أو أن الصفحة نُقلت." />
  );
}
function ErrorComponent({ reset }: ErrorComponentProps) {
  return (
    <section className="mx-auto flex min-h-[56vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-bold tracking-[0.18em] text-brand">ذاكرة بيت حانون</p>
      <h1 className="mt-3 font-heading text-3xl font-extrabold text-foreground">
        تعذر تحميل الصفحة
      </h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        يمكنك إعادة المحاولة أو العودة إلى الصفحة الرئيسية.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-7 rounded-full bg-brand px-5 py-3 text-sm font-bold text-brand-foreground"
      >
        إعادة المحاولة
      </button>
    </section>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ذاكرة بيت حانون | Memory of Beit Hanoun" },
      {
        name: "description",
        content: "Arabic-first memorial archive preserving the names of Beit Hanoun’s martyrs.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "ذاكرة بيت حانون" },
      { name: "twitter:card", content: "summary" },
      { name: "theme-color", content: "#3F4A30" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefsBootScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <PrefsProvider>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
      </PrefsProvider>
    </QueryClientProvider>
  );
}
