import { createClient } from "@supabase/supabase-js";
import * as dotenv from 'dotenv'

dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  throw new Error("Missing env variable: SUPABASE_URL");
}

if (!SUPABASE_ANON_KEY) {
  throw new Error("Missing env variable: SUPABASE_ANON_KEY");
}

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
