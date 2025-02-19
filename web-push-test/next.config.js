/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /node_modules\/ws\/lib\/(buffer-util|validation)\.js/ },
    ];
    return config;
  },
};

module.exports = nextConfig;
