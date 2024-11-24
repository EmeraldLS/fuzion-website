/// <reference path="../.astro/types.d.ts" />

import type { Profile } from "@/model/database";

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_KEY: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    email: string;
    granted: boolean;
    user: Profile;
  }
}
