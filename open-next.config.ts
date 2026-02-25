import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import supabaseIncrementalCache from "./src/lib/cache/supabase-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: supabaseIncrementalCache,
});
