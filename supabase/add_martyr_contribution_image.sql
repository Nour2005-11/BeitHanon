-- Run this small migration once in Supabase SQL Editor.
-- Adds an optional pending photo path to new martyr suggestions.
alter table public.martyr_contributions
  add column if not exists image_path text;
