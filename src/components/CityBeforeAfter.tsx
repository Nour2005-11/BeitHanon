import { Heart, Sunrise } from "lucide-react";
import type { Dict } from "@/lib/i18n";

type CityPhoto = {
  src: string;
  alt: string;
  caption: string;
  featured?: boolean;
};

function PhotoGallery({ photos }: { photos: CityPhoto[] }) {
  return (
    <div className="city-memory-gallery">
      {photos.map((photo) => (
        <figure
          key={photo.src}
          className={`city-memory-photo${photo.featured ? " city-memory-photo--featured" : ""}`}
        >
          <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
          <figcaption>{photo.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export function CityBeforeAfter({ t }: { t: Dict }) {
  const beforePhotos: CityPhoto[] = [
    {
      src: "/images/beit-hanoun-before-after/before-city.jpg",
      alt: t.beforePhotoAlt1,
      caption: t.beforePhotoCaption1,
    },
    {
      src: "/images/beit-hanoun-before-after/before-market.jpg",
      alt: t.beforePhotoAlt2,
      caption: t.beforePhotoCaption2,
    },
    {
      src: "/images/beit-hanoun-before-after/before-shop.jpg",
      alt: t.beforePhotoAlt3,
      caption: t.beforePhotoCaption3,
    },
    {
      src: "/images/beit-hanoun-before-after/before-street.jpg",
      alt: t.beforePhotoAlt4,
      caption: t.beforePhotoCaption4,
    },
  ];
  const afterPhotos: CityPhoto[] = [
    {
      src: "/images/beit-hanoun-before-after/after-street.jpg",
      alt: t.afterPhotoAlt1,
      caption: t.afterPhotoCaption1,
      featured: true,
    },
    {
      src: "/images/beit-hanoun-before-after/after-aerial.jpg",
      alt: t.afterPhotoAlt2,
      caption: t.afterPhotoCaption2,
    },
    {
      src: "/images/beit-hanoun-before-after/after-rubble.jpg",
      alt: t.afterPhotoAlt3,
      caption: t.afterPhotoCaption3,
    },
  ];

  return (
    <section className="city-memory-section mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="city-memory-intro mx-auto max-w-3xl text-center">
        <span className="city-memory-eyebrow">{t.cityMemoryEyebrow}</span>
        <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
          {t.cityMemoryTitle}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {t.cityMemoryLead}
        </p>
      </header>

      <div className="city-memory-grid mt-8">
        <article className="city-memory-card city-memory-card--before">
          <header className="city-memory-card-header">
            <div className="city-memory-card-title-row">
              <span className="city-memory-icon city-memory-icon--before">
                <Sunrise className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-heading text-2xl font-extrabold text-foreground">
                  {t.beforeWarTitle}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {t.beforeWarText}
                </p>
              </div>
            </div>
          </header>
          <PhotoGallery photos={beforePhotos} />
        </article>

        <article className="city-memory-card city-memory-card--after">
          <header className="city-memory-card-header">
            <div className="city-memory-card-title-row">
              <span className="city-memory-icon city-memory-icon--after">
                <Heart className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-heading text-2xl font-extrabold text-foreground">
                  {t.afterWarTitle}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {t.afterWarText}
                </p>
              </div>
            </div>
          </header>
          <PhotoGallery photos={afterPhotos} />
        </article>
      </div>

      <aside className="city-memory-dua">
        <p className="city-memory-dua-label">{t.prayerTitle}</p>
        <p className="city-memory-dua-text">{t.cityMemoryDua}</p>
      </aside>
    </section>
  );
}
