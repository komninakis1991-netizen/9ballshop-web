import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let Wrangler bundle Prisma itself so it picks the Workers (WebAssembly)
  // build instead of the Node.js one, which needs filesystem access.
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
};

export default nextConfig;
