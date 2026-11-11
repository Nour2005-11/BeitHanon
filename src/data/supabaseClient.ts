import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env["VITE_SUPABASE_URL"]?.trim();
const publishableKey = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"]?.trim();

let client: SupabaseClient | null = null;

export function isSupabaseConfigured() {
  return Boolean(url && publishableKey);
}

export function getSupabaseClient() {
  if (!url || !publishableKey) {
    return null;
  }

  if (!client) {
    client = createClient(url, publishableKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }

  return client;
}
