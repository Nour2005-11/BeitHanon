import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { normalizeArchiveText, recordMatchesQuery } from "@/data/arabicSearch";
import {
  formatDateDayMonthYear,
  formatMartyrdomDate,
  parseDayMonthYearToIso,
} from "@/lib/date-format";
import { dict } from "@/lib/i18n";

describe("Stage 2 public archive rules", () => {
  it("normalizes Arabic variants and finds Arabic or English names", () => {
    expect(normalizeArchiveText("إِبْرَاهِيمُ ــ أحمد")).toBe("ابراهيم احمد");
    expect(recordMatchesQuery("إبراهيم أحمد", "Ibrahim Ahmad", "ابراهيم")).toBe(true);
    expect(recordMatchesQuery("إبراهيم أحمد", "Ibrahim Ahmad", "ibrahim")).toBe(true);
    expect(recordMatchesQuery("إبراهيم أحمد", "Ibrahim Ahmad", "not-a-match")).toBe(false);
  });

  it("keeps archive filtering name-only and removes the month picker", () => {
    const archiveRoute = readFileSync(
      resolve(process.cwd(), "src/routes/archive.index.tsx"),
      "utf8",
    );
    expect(archiveRoute).toContain('type="search"');
    expect(archiveRoute).not.toContain('type="month"');
    expect(archiveRoute).not.toContain("month:");
    expect(recordMatchesQuery("مصطفى ضرغام", "Mustafa Dirgham", "mustafa")).toBe(true);
  });

  it("formats dates as day-month-year and validates the contribution input", () => {
    expect(formatDateDayMonthYear("2023-10-07")).toBe("07-10-2023");
    expect(formatDateDayMonthYear("7/10/2023")).toBe("07-10-2023");
    expect(formatDateDayMonthYear("10/25/2023")).toBe("25-10-2023");
    expect(formatDateDayMonthYear("٠٧/١٠/٢٠٢٣")).toBe("07-10-2023");
    expect(formatDateDayMonthYear("31-02-2024")).toBeNull();
    expect(formatMartyrdomDate("2023-10-07", "10/07/2023")).toBe("07-10-2023");
    expect(parseDayMonthYearToIso("07-10-2023")).toBe("2023-10-07");
    expect(parseDayMonthYearToIso("07/10/2023")).toBe("2023-10-07");
    expect(parseDayMonthYearToIso("2023/10/07")).toBe("2023-10-07");
    expect(parseDayMonthYearToIso("2023-10-07")).toBe("2023-10-07");
    expect(parseDayMonthYearToIso("7/10/2023")).toBe("2023-10-07");
    expect(parseDayMonthYearToIso("7 / 10 / 2023")).toBe("2023-10-07");
    expect(parseDayMonthYearToIso("07.10.2023")).toBe("2023-10-07");
    expect(parseDayMonthYearToIso("07102023")).toBe("2023-10-07");
    expect(parseDayMonthYearToIso("20231007")).toBe("2023-10-07");
    expect(parseDayMonthYearToIso("٠٧١٠٢٠٢٣")).toBe("2023-10-07");
    expect(parseDayMonthYearToIso("29-02-2024")).toBe("2024-02-29");
    expect(parseDayMonthYearToIso("31-02-2024")).toBeNull();
  });

  it("includes the supplied before-and-after city photographs", () => {
    const photoDirectory = resolve(process.cwd(), "public/images/beit-hanoun-before-after");
    const photos = [
      "before-city.jpg",
      "before-market.jpg",
      "before-shop.jpg",
      "before-street.jpg",
      "after-street.jpg",
      "after-aerial.jpg",
      "after-rubble.jpg",
    ];
    expect(photos.every((photo) => existsSync(resolve(photoDirectory, photo)))).toBe(true);
  });

  it("previews pending photos through signed URLs and an admin-only storage policy", () => {
    const adminRoute = readFileSync(resolve(process.cwd(), "src/routes/admin.tsx"), "utf8");
    const adminSetup = readFileSync(
      resolve(process.cwd(), "supabase/admin_dashboard_setup.sql"),
      "utf8",
    );
    expect(adminRoute).toContain('.from("pending-martyr-photos")');
    expect(adminRoute).toContain("createSignedUrl(path, 10 * 60)");
    expect(adminRoute).toContain("<AdminPhotoPreview");
    expect(adminSetup).toContain('"Admins can read pending martyr photos"');
  });

  it("keeps public labels available in Arabic and English", () => {
    expect(dict.ar.footerRights(2031)).toContain("2031");
    expect(dict.en.footerRights(2031)).toContain("2031");
    expect(dict.ar.nav.contribute).toBeTruthy();
    expect(dict.en.nav.contribute).toBeTruthy();
  });

  it("does not retain the bundled reference data as a production source", () => {
    expect(() => readFileSync(resolve(process.cwd(), "src/data/martyrs.json"), "utf8")).toThrow();
  });

  it("contains no Supabase mutation method in the public repository", () => {
    const repository = readFileSync(resolve(process.cwd(), "src/data/martyrRepository.ts"), "utf8");
    expect(repository).not.toMatch(/\.(insert|update|upsert|delete)\s*\(/);
  });
});
