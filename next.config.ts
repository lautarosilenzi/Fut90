import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Las fotos/videos de los tuits y las fotos de perfil viven en Supabase
    // Storage, que sirve todo desde *.supabase.co (o *.supabase.in).
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.supabase.in" },
    ],
  },
};

export default nextConfig;
