import { ExternalLink, Image as ImageIcon } from "lucide-react";

type AdminPhotoPreviewProps = {
  hasImage: boolean;
  previewUrl: string | null;
  alt: string;
  openLabel: string;
  missingLabel: string;
  unavailableLabel: string;
};

export function AdminPhotoPreview({
  hasImage,
  previewUrl,
  alt,
  openLabel,
  missingLabel,
  unavailableLabel,
}: AdminPhotoPreviewProps) {
  return (
    <div className="admin-photo-preview">
      {hasImage && previewUrl ? (
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={openLabel}
          className="admin-photo-preview-link"
        >
          <img
            src={previewUrl}
            alt={alt}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
          <span>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            {openLabel}
          </span>
        </a>
      ) : (
        <div className="admin-photo-preview-fallback" role="status">
          <ImageIcon className="h-7 w-7" aria-hidden="true" />
          <span>{hasImage ? unavailableLabel : missingLabel}</span>
        </div>
      )}
    </div>
  );
}
