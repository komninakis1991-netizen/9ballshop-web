import { createHash } from "node:crypto";
import type {
  CacheEntryType,
  CacheValue,
  IncrementalCache,
  WithLastModified,
} from "@opennextjs/aws/types/overrides";

const NAME = "supabase-incremental-cache";
const DEFAULT_PREFIX = "incremental-cache";
const FALLBACK_BUILD_ID = "no-build-id";
const TABLE = "next_inc_cache";

function computeCacheKey(
  key: string,
  options: { prefix?: string; buildId?: string; cacheType?: string }
): string {
  const {
    cacheType = "cache",
    prefix = DEFAULT_PREFIX,
    buildId = FALLBACK_BUILD_ID,
  } = options;
  const hash = createHash("sha256").update(key).digest("hex");
  return `${prefix}/${buildId}/${hash}.${cacheType}`.replace(/\/+/g, "/");
}

function debugCache(name: string, ...args: unknown[]) {
  if (process.env.NEXT_PRIVATE_DEBUG_CACHE) {
    console.log(`[${name}] `, ...args);
  }
}

function getConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

class SupabaseIncrementalCache implements IncrementalCache {
  name = NAME;

  async get<CacheType extends CacheEntryType = "cache">(
    key: string,
    cacheType?: CacheType
  ): Promise<WithLastModified<CacheValue<CacheType>> | null> {
    const config = getConfig();
    if (!config) {
      console.error("[SupabaseIncrementalCache] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
      return null;
    }

    const cacheKey = computeCacheKey(key, {
      buildId: process.env.NEXT_BUILD_ID,
      cacheType,
    });

    debugCache(NAME, `get ${key} → ${cacheKey}`);

    try {
      const res = await fetch(
        `${config.url}/rest/v1/${TABLE}?key=eq.${encodeURIComponent(cacheKey)}&select=value,last_modified`,
        {
          method: "GET",
          headers: {
            apikey: config.key,
            Authorization: `Bearer ${config.key}`,
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) {
        console.error(`[SupabaseIncrementalCache] GET failed: ${res.status} ${res.statusText}`);
        return null;
      }

      const rows = (await res.json()) as Array<{
        value: CacheValue<CacheType>;
        last_modified: number;
      }>;

      if (!rows.length) return null;

      const row = rows[0];
      return {
        value: row.value,
        lastModified: row.last_modified,
      };
    } catch (e) {
      console.error("[SupabaseIncrementalCache] Failed to get from cache", e);
      return null;
    }
  }

  async set<CacheType extends CacheEntryType = "cache">(
    key: string,
    value: CacheValue<CacheType>,
    cacheType?: CacheType
  ): Promise<void> {
    const config = getConfig();
    if (!config) {
      console.error("[SupabaseIncrementalCache] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
      return;
    }

    const cacheKey = computeCacheKey(key, {
      buildId: process.env.NEXT_BUILD_ID,
      cacheType,
    });

    debugCache(NAME, `set ${key} → ${cacheKey}`);

    try {
      const res = await fetch(`${config.url}/rest/v1/${TABLE}`, {
        method: "POST",
        headers: {
          apikey: config.key,
          Authorization: `Bearer ${config.key}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          key: cacheKey,
          value,
          last_modified: Date.now(),
        }),
      });

      if (!res.ok) {
        console.error(`[SupabaseIncrementalCache] SET failed: ${res.status} ${res.statusText}`);
      }
    } catch (e) {
      console.error("[SupabaseIncrementalCache] Failed to set to cache", e);
    }
  }

  async delete(key: string): Promise<void> {
    const config = getConfig();
    if (!config) {
      console.error("[SupabaseIncrementalCache] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
      return;
    }

    const cacheKey = computeCacheKey(key, {
      buildId: process.env.NEXT_BUILD_ID,
      cacheType: "cache",
    });

    debugCache(NAME, `delete ${key} → ${cacheKey}`);

    try {
      const res = await fetch(
        `${config.url}/rest/v1/${TABLE}?key=eq.${encodeURIComponent(cacheKey)}`,
        {
          method: "DELETE",
          headers: {
            apikey: config.key,
            Authorization: `Bearer ${config.key}`,
          },
        }
      );

      if (!res.ok) {
        console.error(`[SupabaseIncrementalCache] DELETE failed: ${res.status} ${res.statusText}`);
      }
    } catch (e) {
      console.error("[SupabaseIncrementalCache] Failed to delete from cache", e);
    }
  }
}

export default new SupabaseIncrementalCache();
