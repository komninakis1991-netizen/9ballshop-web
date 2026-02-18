import type { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export async function getPrisma(): Promise<PrismaClient> {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  // Cloudflare Workers: use D1 adapter
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext();
    if (ctx?.env?.DB) {
      const { PrismaD1 } = await import("@prisma/adapter-d1");
      const { PrismaClient: PC } = await import("@prisma/client");
      const adapter = new PrismaD1(ctx.env.DB);
      const client = new PC({ adapter }) as unknown as PrismaClient;
      globalForPrisma.prisma = client;
      return client;
    }
  } catch {
    // Not in Cloudflare Workers environment
  }

  // Local development with SQLite
  if (!globalForPrisma.prisma) {
    const mod = "@prisma/" + "client";
    const { PrismaClient: PC } = await import(mod);
    globalForPrisma.prisma = new PC();
  }
  return globalForPrisma.prisma;
}
