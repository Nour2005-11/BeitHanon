export type DateStatus = "ok" | "review" | null;

/** Verified public columns returned by the existing `martyrs` table. */
export type DbMartyrRow = {
  id: number;
  name_ar: string;
  name_en: string | null;
  birth_date: string | null;
  martyrdom_date: string | null;
  image_url: string | null;
  source: string | null;
  created_at: string | null;
  updated_at: string | null;
  source_row: number | null;
  martyrdom_date_raw: string | null;
  date_status: DateStatus;
};

export type MartyrRecord = {
  id: number;
  legacyReference: string | null;
  arabicName: string;
  englishName: string | null;
  birthDate: string | null;
  martyrdomDate: string | null;
  martyrdomDateRaw: string | null;
  dateStatus: DateStatus;
  imageUrl: string | null;
  source: string | null;
};

export type ArchivePage = {
  records: MartyrRecord[];
  total: number;
  page: number;
  pageSize: number;
};

export type ArchiveStats = {
  total: number;
  withPhotos: number;
  withoutPhotos: number;
  datesForReview: number;
};

export type ArchiveQuery = {
  page: number;
  pageSize: number;
  query?: string;
};
