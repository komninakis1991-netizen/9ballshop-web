import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let Wrangler bundle Prisma itself so it picks the Workers (WebAssembly)
  // build instead of the Node.js one, which needs filesystem access.
  serverExternalPackages: ["@prisma/client", ".prisma/client"],

  async redirects() {
    return [
      // One main address: www.9ballshop.com -> 9ballshop.com
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.9ballshop.com" }],
        destination: "https://9ballshop.com/:path*",
        permanent: true,
      },
      // Old shop addresses that Google still remembers
      { source: "/products/:path*", destination: "/lessons", permanent: true },
      { source: "/collections/:path*", destination: "/lessons", permanent: true },
      { source: "/blogs/:path*", destination: "/blog", permanent: true },
      { source: "/pages/:path*", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
