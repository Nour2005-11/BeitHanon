function buildIsoDate(day: number, month: number, year: number) {
  if (year < 1000 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function isoToDayMonthYear(iso: string) {
  return `${iso.slice(8, 10)}-${iso.slice(5, 7)}-${iso.slice(0, 4)}`;
}

function normalizeDigits(value: string) {
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  return value.replace(/[٠-٩۰-۹]/g, (digit) => {
    const arabicIndex = arabic.indexOf(digit);
    if (arabicIndex >= 0) return String(arabicIndex);
    return String(persian.indexOf(digit));
  });
}

export function parseDayMonthYearToIso(value: string) {
  if (!value.trim()) return null;
  const normalized = normalizeDigits(value.trim()).replace(/\s+/g, "");
  const yearFirst = normalized.match(/^([0-9]{4})[-/.\s]([0-9]{1,2})[-/.\s]([0-9]{1,2})$/);
  if (yearFirst) {
    const [, year, month, day] = yearFirst;
    return buildIsoDate(Number(day), Number(month), Number(year));
  }

  const compactYearFirst = normalized.match(/^([0-9]{4})([0-9]{2})([0-9]{2})$/);
  if (compactYearFirst && Number(compactYearFirst[1]) >= 1000) {
    const [, year, month, day] = compactYearFirst;
    return buildIsoDate(Number(day), Number(month), Number(year));
  }

  const compact = normalized.match(/^([0-9]{2})([0-9]{2})([0-9]{4})$/);
  if (compact) {
    const [, day, month, year] = compact;
    return buildIsoDate(Number(day), Number(month), Number(year));
  }

  const separated = normalized.match(/^([0-9]{1,2})[-/.\s]([0-9]{1,2})[-/.\s]([0-9]{4})$/);
  if (!separated) return null;
  const [, first, second, year] = separated;
  let day = Number(first);
  let month = Number(second);
  if (day <= 12 && month > 12) [day, month] = [month, day];
  return buildIsoDate(day, month, Number(year));
}

export function formatDateDayMonthYear(value: string | null | undefined) {
  const text = value?.trim();
  if (!text) return null;
  const normalized = normalizeDigits(text);

  const yearFirst = normalized.match(
    /^([0-9]{4})[-/.\s]([0-9]{1,2})[-/.\s]([0-9]{1,2})(?:$|[T\s])/,
  );
  if (yearFirst) {
    const [, year, month, day] = yearFirst;
    const iso = buildIsoDate(Number(day), Number(month), Number(year));
    return iso ? isoToDayMonthYear(iso) : null;
  }

  const separated = normalized.match(
    /^([0-9]{1,2})[-/.\s]([0-9]{1,2})[-/.\s]([0-9]{4})(?:$|[T\s])/,
  );
  if (!separated) return null;

  const [, first, second, year] = separated;
  let day = Number(first);
  let month = Number(second);
  // If only the second field can be a day, treat the source as month-first and normalize it.
  if (day <= 12 && month > 12) {
    [day, month] = [month, day];
  }
  const iso = buildIsoDate(day, month, Number(year));
  return iso ? isoToDayMonthYear(iso) : null;
}

export function formatMartyrdomDate(
  canonicalDate: string | null | undefined,
  rawDate: string | null | undefined,
) {
  return formatDateDayMonthYear(canonicalDate) ?? formatDateDayMonthYear(rawDate);
}
