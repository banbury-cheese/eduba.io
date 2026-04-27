import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value: '</sitemap.xml>; rel="sitemap"',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
