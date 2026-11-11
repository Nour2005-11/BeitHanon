import { useState } from "react";
import { BrandMark } from "./BrandMark";

type MartyrPhotoProps = {
  src: string | null;
  alt: string;
  placeholderLabel: string;
  className?: string;
};

export function MartyrPhoto({ src, alt, placeholderLabel, className = "" }: MartyrPhotoProps) {
  const [failed, setFailed] = useState(false);
  const hasImage = Boolean(src && !failed);

  return (
    <div className={`relative grid overflow-hidden bg-photo-surface ${className}`}>
      {hasImage ? (
        <img
          src={src ?? undefined}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="m-auto flex max-w-[15rem] flex-col items-center gap-3 px-6 text-center text-muted-foreground"
          role="img"
          aria-label={placeholderLabel}
        >
          <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-deep/10">
            <BrandMark className="h-16 w-16" />
          </span>
          <span className="text-sm font-medium leading-relaxed">{placeholderLabel}</span>
        </div>
      )}
    </div>
  );
}
