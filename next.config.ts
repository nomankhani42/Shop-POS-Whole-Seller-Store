/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: ["ik.imagekit.io"],
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ disables ESLint errors during builds
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ disables TS errors during builds
  },
};

export default nextConfig;
