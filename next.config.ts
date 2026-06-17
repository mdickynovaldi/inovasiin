import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // `images.domains` was deprecated in Next 16 in favor of `remotePatterns`.
    remotePatterns: [
      { protocol: "https", hostname: "i.pinimg.com" },
      // Supabase Storage (portfolio thumbnails / media)
      { protocol: "https", hostname: "*.supabase.co" },
      // Inovasiin CDN (where portfolio screenshots are hosted)
      { protocol: "https", hostname: "cdn.inovasiin.studio" },
      { protocol: "https", hostname: "**.inovasiin.studio" },
    ],
  },
};

export default nextConfig;
