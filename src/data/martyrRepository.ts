import { recordMatchesQuery } from "./arabicSearch";
import type {
  ArchivePage,
  ArchiveQuery,
  ArchiveStats,
  DbMartyrRow,
  MartyrRecord,
} from "./martyrTypes";
import { getSupabaseClient, isSupabaseConfigured } from "./supabaseClient";

const MARTYR_COLUMNS =
  "id,name_ar,name_en,birth_date,martyrdom_date,image_url,source,created_at,updated_at,source_row,martyrdom_date_raw,date_status";

function requireClient() {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error(
      "Supabase configuration is unavailable. Add the public project URL and publishable key in the managed environment settings.",
    );
  }
  return client;
}

function toRecord(row: DbMartyrRow): MartyrRecord {
  const id = Number(row.id);
  const legacyReference =
    Number.isInteger(id) && id >= 1 && id <= 756 ? `BH-${String(id).padStart(4, "0")}` : null;

  return {
    id,
    legacyReference,
    arabicName: row.name_ar,
    englishName: row.name_en || null,
    birthDate: row.birth_date || null,
    martyrdomDate: row.martyrdom_date || null,
    martyrdomDateRaw: row.martyrdom_date_raw || null,
    dateStatus: row.date_status,
    imageUrl: row.image_url?.trim() || null,
    source: row.source?.trim() || null,
  };
}

function normalizeError(message: string) {
  return message || "The archive could not be loaded. Please try again.";
}

export function hasArchiveConnection() {
  return isSupabaseConfigured();
}

export async function getArchivePage({
  page,
  pageSize,
  query = "",
}: ArchiveQuery): Promise<ArchivePage> {
  const client = requireClient();
  const normalizedPage = Math.max(1, page);
  const cleanedQuery = query.trim();

  if (!cleanedQuery) {
    const from = (normalizedPage - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error, count } = await client
      .from("martyrs")
      .select(MARTYR_COLUMNS, { count: "exact" })
      .order("id", { ascending: true })
      .range(from, to);

    if (error) throw new Error(normalizeError(error.message));
    return {
      records: ((data ?? []) as DbMartyrRow[]).map(toRecord),
      total: count ?? 0,
      page: normalizedPage,
      pageSize,
    };
  }

  // The official archive currently has 756 records. Read-only in-memory matching preserves
  // Arabic normalization without changing the database or relying on guessed search columns.
  const { data, error } = await client
    .from("martyrs")
    .select(MARTYR_COLUMNS)
    .order("id", { ascending: true })
    .range(0, 999);
  if (error) throw new Error(normalizeError(error.message));

  const filtered = ((data ?? []) as DbMartyrRow[])
    .map(toRecord)
    .filter((record) => recordMatchesQuery(record.arabicName, record.englishName, cleanedQuery));
  const start = (normalizedPage - 1) * pageSize;

  return {
    records: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page: normalizedPage,
    pageSize,
  };
}

export async function getMartyrById(id: number) {
  const client = requireClient();
  const { data, error } = await client
    .from("martyrs")
    .select(MARTYR_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(normalizeError(error.message));
  return data ? toRecord(data as DbMartyrRow) : null;
}

export async function getArchiveStats(): Promise<ArchiveStats> {
  const client = requireClient();
  const [totalResult, photoResult, reviewResult] = await Promise.all([
    client.from("martyrs").select("id", { count: "exact", head: true }),
    client
      .from("martyrs")
      .select("id", { count: "exact", head: true })
      .not("image_url", "is", null)
      .neq("image_url", ""),
    client.from("martyrs").select("id", { count: "exact", head: true }).eq("date_status", "review"),
  ]);

  const firstError = totalResult.error || photoResult.error || reviewResult.error;
  if (firstError) throw new Error(normalizeError(firstError.message));

  const total = totalResult.count ?? 0;
  const withPhotos = photoResult.count ?? 0;
  return {
    total,
    withPhotos,
    withoutPhotos: Math.max(0, total - withPhotos),
    datesForReview: reviewResult.count ?? 0,
  };
}

export async function getFeaturedMartyrs(limit = 3) {
  const client = requireClient();
  const { data, error } = await client
    .from("martyrs")
    .select(MARTYR_COLUMNS)
    .not("image_url", "is", null)
    .neq("image_url", "")
    .order("id", { ascending: true })
    .limit(limit);

  if (error) throw new Error(normalizeError(error.message));
  return ((data ?? []) as DbMartyrRow[]).map(toRecord);
}
