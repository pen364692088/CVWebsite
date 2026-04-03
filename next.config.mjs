/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/CVWebsite",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
