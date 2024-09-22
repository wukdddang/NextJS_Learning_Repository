/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["lumir-internal-design-system"],
  async headers() {
    return [
      {
        source: "/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
