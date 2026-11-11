import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, FileImage, ImagePlus, ShieldCheck, Upload } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/data/supabaseClient";
import { formatDateDayMonthYear, parseDayMonthYearToIso } from "@/lib/date-format";
import { usePrefs } from "@/lib/prefs";

export const Route = createFileRoute("/suggest")({
  validateSearch: (search: Record<string, unknown>) => ({
    martyrId: typeof search["martyrId"] === "string" ? search["martyrId"] : "",
  }),
  head: () => ({ meta: [{ title: "المساهمة | ذاكرة بيت حانون" }] }),
  component: Suggest,
});

function parseRecordId(value: string) {
  const match = value.trim().match(/^(?:BH\s*-\s*)?0*(\d+)$/i);
  if (!match) return null;
  const id = Number(match[1]);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function Suggest() {
  const { t, lang } = usePrefs();
  const search = Route.useSearch();
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [martyrId, setMartyrId] = useState(search.martyrId);
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const ar = lang === "ar";
  const hasRecordReference = martyrId.trim().length > 0;
  const existingRecordId = parseRecordId(martyrId);

  useEffect(() => setMartyrId(search.martyrId), [search.martyrId]);

  function removeSelectedPhoto() {
    setFile(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);

    if (hasRecordReference && existingRecordId === null) {
      return;
    }
    if (existingRecordId !== null && !file) {
      setMessage(t.photoRequiredError);
      return;
    }
    if (
      file &&
      (!(["image/jpeg", "image/png", "image/webp"] as string[]).includes(file.type) ||
        file.size > 8 * 1024 * 1024)
    ) {
      setMessage(file.size > 8 * 1024 * 1024 ? t.photoSizeError : t.photoFormatError);
      return;
    }
    const martyrdomDate = parseDayMonthYearToIso(date);
    if (date.trim() && !martyrdomDate) {
      setMessage(t.dateFormatError);
      return;
    }

    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      setMessage(t.databaseConnectionError);
      return;
    }

    setBusy(true);
    try {
      let photoPath: string | null = null;
      if (file) {
        const ext =
          file.name
            .split(".")
            .pop()
            ?.toLowerCase()
            .replace(/[^a-z0-9]/g, "") || "jpg";
        const random =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        photoPath = `suggestions/${random}.${ext}`;
        const upload = await client.storage
          .from("pending-martyr-photos")
          .upload(photoPath, file, { upsert: false, contentType: file.type });
        if (upload.error) throw upload.error;
      }

      if (existingRecordId !== null) {
        const { error } = await client.from("photo_contributions").insert({
          martyr_id: existingRecordId,
          photo_path: photoPath,
          notes: notes.trim() || null,
        });
        if (error) {
          if (photoPath) await client.storage.from("pending-martyr-photos").remove([photoPath]);
          throw error;
        }
      } else {
        const { error } = await client.from("martyr_contributions").insert({
          name_ar: nameAr.trim(),
          name_en: nameEn.trim() || null,
          martyrdom_date: martyrdomDate,
          image_path: photoPath,
          notes: notes.trim() || null,
        });
        if (error) {
          if (photoPath) await client.storage.from("pending-martyr-photos").remove([photoPath]);
          throw error;
        }
      }

      setSuccess(true);
      setMessage(t.submissionSuccess);
      setNameAr("");
      setNameEn("");
      setMartyrId("");
      setDate("");
      setNotes("");
      removeSelectedPhoto();
    } catch (error) {
      console.error("Contribution submission failed", error);
      setMessage(t.submissionError);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold tracking-[0.16em] text-brand">{t.nav.contribute}</p>
        <h1 className="mt-3 font-heading text-4xl font-extrabold text-foreground sm:text-5xl">
          {t.contributeTitle}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{t.contributeLead}</p>
      </header>
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <form
          className="rounded-[1.7rem] border border-border bg-card p-6 shadow-card sm:p-8"
          onSubmit={submit}
        >
          <div className="grid gap-5">
            <div>
              <label htmlFor="contribution-record-id" className="text-sm font-bold text-foreground">
                {t.recordId}{" "}
                <span className="font-normal text-muted-foreground">({t.optional})</span>
              </label>
              <input
                id="contribution-record-id"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={martyrId}
                onChange={(event) => setMartyrId(event.target.value)}
                placeholder={t.recordIdPlaceholder}
                aria-describedby="record-id-hint"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
              <p
                id="record-id-hint"
                className="mt-1.5 text-xs leading-relaxed text-muted-foreground"
              >
                {t.recordIdHint}
              </p>
            </div>

            {existingRecordId !== null ? (
              <div className="flex items-start gap-3 rounded-xl border border-brand/20 bg-secondary/70 p-4 text-sm leading-relaxed text-foreground">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                <p>{t.recordPhotoContext}</p>
              </div>
            ) : hasRecordReference ? (
              <p
                className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
                role="status"
              >
                {t.recordIdInvalid}
              </p>
            ) : (
              <>
                <label className="block">
                  <span className="text-sm font-bold text-foreground">{t.fullNameAr} *</span>
                  <input
                    required
                    value={nameAr}
                    onChange={(event) => setNameAr(event.target.value)}
                    maxLength={180}
                    autoComplete="name"
                    className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-foreground">{t.fullNameEn}</span>
                  <input
                    value={nameEn}
                    onChange={(event) => setNameEn(event.target.value)}
                    maxLength={180}
                    dir="auto"
                    className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-foreground">{t.martyrdomDate}</span>
                  <span
                    id="martyrdom-date-hint"
                    className="mt-1 block text-xs text-muted-foreground"
                  >
                    {t.dateFormatHint}
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={20}
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    onBlur={() => {
                      const iso = parseDayMonthYearToIso(date);
                      if (iso) setDate(formatDateDayMonthYear(iso) ?? date);
                    }}
                    placeholder={t.dateFormatPlaceholder}
                    aria-describedby="martyrdom-date-hint"
                    className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </label>
              </>
            )}

            <div>
              <span className="text-sm font-bold text-foreground">
                {t.uploadPhoto}{" "}
                <span className="font-normal text-muted-foreground">
                  ({existingRecordId ? t.required : t.optional})
                </span>
              </span>
              <label
                htmlFor="contribution-photo"
                className="mt-2 flex min-h-24 cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-brand/45 bg-secondary/40 p-4 transition-colors hover:border-brand hover:bg-secondary"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand/15 text-brand">
                  <ImagePlus className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-foreground">
                    {file ? file.name : t.uploadPhotoTitle}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {file ? t.photoSelected : t.uploadPhotoHint}
                  </span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-brand/25 bg-card px-3 py-2 text-xs font-extrabold text-brand">
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  {t.choosePhoto}
                </span>
              </label>
              <input
                ref={photoInputRef}
                id="contribution-photo"
                type="file"
                required={existingRecordId !== null}
                accept="image/jpeg,image/png,image/webp"
                aria-describedby="photo-upload-hint"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="sr-only"
              />
              <p id="photo-upload-hint" className="mt-2 text-xs text-muted-foreground">
                {t.photoPrivacy}
              </p>
              {file ? (
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-xs text-foreground">
                  <FileImage className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate" dir="auto">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={removeSelectedPhoto}
                    className="shrink-0 font-bold text-brand underline underline-offset-2"
                  >
                    {t.removePhoto}
                  </button>
                </div>
              ) : null}
            </div>

            <label className="block">
              <span className="text-sm font-bold text-foreground">{t.notes}</span>
              <span className="mt-1 block text-xs font-normal text-muted-foreground">
                {t.notesHint}
              </span>
              <textarea
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                maxLength={1500}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </label>

            <button
              disabled={busy}
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 font-bold text-brand-foreground transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? t.sending : t.submitForReview}
            </button>
            {message ? (
              <p
                role="status"
                className={`rounded-xl p-4 text-sm leading-relaxed ${success ? "bg-secondary text-foreground" : "bg-destructive/10 text-destructive"}`}
              >
                {success ? <CheckCircle2 className="me-2 inline h-4 w-4" /> : null}
                {message}
              </p>
            ) : null}
          </div>
        </form>
        <aside className="rounded-[1.7rem] bg-secondary p-7">
          <ShieldCheck className="h-8 w-8 text-brand" aria-hidden="true" />
          <h2 className="mt-5 font-heading text-2xl font-extrabold text-foreground">
            {t.memorialNoteTitle}
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{t.martyrOmissionText}</p>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {t.beitHanounSacrificeText}
          </p>
        </aside>
      </div>
    </section>
  );
}
