type BrandMarkProps = { className?: string; title?: string };

export function BrandMark({ className = "h-10 w-10", title }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      fill="none"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <circle cx="48" cy="48" r="44" className="fill-brand-deep" />
      <path
        d="M17 64c16-7 47-7 62 0M20 72c15-6 40-6 55 0"
        className="stroke-sand"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M46 65c1-17 0-30 14-47"
        className="stroke-ivory"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M42 48c-8-2-12-7-13-13 8 0 13 4 13 13ZM50 38c6-6 12-7 18-4-3 7-10 9-18 4ZM43 34c-6-3-8-8-7-13 7 1 10 6 7 13ZM55 27c4-5 9-6 14-4-2 6-8 8-14 4Z"
        className="fill-ivory"
      />
      <circle cx="47" cy="56" r="4" className="fill-accent" />
    </svg>
  );
}

export function BrandLockup({ name, subtitle }: { name: string; subtitle: string }) {
  return (
    <span className="flex items-center gap-3">
      <BrandMark className="h-10 w-10 shrink-0" />
      <span className="flex flex-col leading-tight">
        <span className="font-heading text-base font-extrabold tracking-tight text-foreground sm:text-lg">
          {name}
        </span>
        <span className="text-[0.7rem] font-medium tracking-wide text-muted-foreground">
          {subtitle}
        </span>
      </span>
    </span>
  );
}
