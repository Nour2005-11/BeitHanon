/** Original mark: olive branch rising over field furrows. Uses currentColor + gold token. */
export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" fill="none">
      <circle cx="32" cy="32" r="30" className="fill-primary" />
      <path
        d="M12 46c8-3 32-3 40 0M15 51c7-2 27-2 34 0"
        className="stroke-gold"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M32 44C32 34 30 24 36 14"
        className="stroke-primary-foreground"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <g className="fill-primary-foreground">
        <ellipse cx="27" cy="34" rx="5.5" ry="2.4" transform="rotate(-30 27 34)" />
        <ellipse cx="38" cy="30" rx="5.5" ry="2.4" transform="rotate(25 38 30)" />
        <ellipse cx="29" cy="25" rx="5" ry="2.2" transform="rotate(-40 29 25)" />
        <ellipse cx="40" cy="20" rx="4.6" ry="2" transform="rotate(30 40 20)" />
      </g>
      <circle cx="34" cy="37" r="2.4" className="fill-gold" />
    </svg>
  );
}

export function Logo({ name, sub }: { name: string; sub: string }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark />
      <span className="flex flex-col leading-tight">
        <span className="font-heading text-lg font-bold text-foreground">{name}</span>
        <span className="text-xs text-muted-foreground">{sub}</span>
      </span>
    </span>
  );
}
