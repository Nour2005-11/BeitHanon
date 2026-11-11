export function normalizeArchiveText(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, "")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[-'’]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function recordMatchesQuery(arabicName: string, englishName: string | null, query: string) {
  const normalizedQuery = normalizeArchiveText(query);
  if (!normalizedQuery) return true;

  const searchKey = normalizeArchiveText(`${arabicName} ${englishName ?? ""}`);
  return normalizedQuery.split(" ").every((term) => searchKey.includes(term));
}
