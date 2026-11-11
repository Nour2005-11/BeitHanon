# Changes applied to the supplied project

- Replaced the two-button Arabic/English selector with one button that shows the language it will switch to.
- Kept the dark-mode control in the header beside the hamburger menu; opening the mobile menu no longer moves the control into the menu.
- Removed the archive month/date filter and its query/repository plumbing. Archive search now matches names in Arabic or English only.
- Improved the archive search layout so the search action stays at the edge of the search field.
- Applied distinct, stronger colors to the archive statistics and their icons.
- Removed the repeated “Add photo” links from individual cards and detail pages.
- Combined new-martyr and existing-record photo contributions into one form. The optional record reference can be entered as the numeric ID or the verified `BH-####` reference. When an existing record is selected, the form asks for the photo without repeating name/date fields; for a new record it accepts name/date and an optional photo. Notes appear once.
- Made image selection a prominent icon-and-button area with selected filename, removal action, and validation for JPEG/PNG/WebP up to 8 MB.
- Added private photo previews to the authenticated admin review queues through 10-minute signed URLs; the pending-photo bucket remains private and existing approve/reject actions are retained.
- Standardized martyrdom and birth-date display to `DD-MM-YYYY`; the contribution form accepts day-first or year-first numeric dates with common separators, then normalizes valid dates for display and ISO storage.
- Unified archive-card and detail-page date selection: prefer the canonical stored date, normalize supported raw variants to `DD-MM-YYYY`, and avoid showing unparseable raw strings in mixed formats.
- Added seven user-provided photos in two styled “Before the war” and “After the war” cards, with reflective text and a dua, on the About Beit Hanoun page (not the homepage).

The existing pending contribution tables, storage bucket and Supabase policies are unchanged. The public archive remains read-only; this does not enable or modify the live database setup.
