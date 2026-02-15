import type { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export async function getPrisma(): Promise<PrismaClient> {
  // Local development with SQLite
  if (process.env.DATABASE_URL) {
    if (!globalForPrisma.prisma) {
      // Use dynamic string to prevent bundler from including Node.js Prisma client
      const mod = "@prisma/" + "client";
      const { PrismaClient: PC } = await import(mod);
      globalForPrisma.prisma = new PC();
    }
    return globalForPrisma.prisma;
  }

  // Cloudflare D1
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
  const { env } = await getCloudflareContext();
  const { PrismaD1 } = await import("@prisma/adapter-d1");
  const { PrismaClient: PrismaClientEdge } = await import("@prisma/client/edge");
  const adapter = new PrismaD1(env.DB);
  return new PrismaClientEdge({ adapter }) as unknown as PrismaClient;
}
