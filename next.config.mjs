/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/CVWebsite",
  trailingSlash: true,
  transpilePackages: ["three"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
