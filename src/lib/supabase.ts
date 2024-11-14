import { createClient } from "@supabase/supabase-js";

import { SUPABASE_URL, SUPABASE_ANON_KEY } from "astro:env/server"

if (!SUPABASE_URL) {
  throw new Error("Missing env variable: SUPABASE_URL");
}

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
