// @ts-check
import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  adapter: node({
    mode: "standalone",
  }),
  experimental: {
    env: {
        schema: {
            SUPABASE_URL: envField.string({ context: "server", access: "secret" }),
            SUPABASE_ANON_KEY: envField.string({ context: "server", access: "secret" }),
            PORT: envField.number({ context: "server", access: "public", default: 4321 }),
            AUTHORIZED_IPS: envField.string({ context: "server", access: "secret" })
        }
    }
}
});
