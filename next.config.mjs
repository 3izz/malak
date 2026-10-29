/** @type {import('next').NextConfig} */
// GitHub Pages serves a project site from /<repo-name>/. The deploy workflow sets
// NEXT_PUBLIC_BASE_PATH to that prefix; locally it is empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
