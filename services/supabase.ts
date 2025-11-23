import { createClient } from "@supabase/supabase-js";

const DEFAULT_URL = "https://csrbcnrbscuwkbhyhvqy.supabase.co";
const DEFAULT_ANON_KEY = "sb_publishable_C3jZdZpbGPnEVLdQnJgUtg_H_4UyKTI";

const url = (import.meta.env.VITE_SUPABASE_URL as string) ?? DEFAULT_URL;
const anonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ?? DEFAULT_ANON_KEY;

export const supabase = createClient(url, anonKey);
