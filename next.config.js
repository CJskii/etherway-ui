/** @type {import('next').NextConfig} */

const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const nextConfig = {
  reactStrictMode: true,
  webpack(config, { isServer }) {
    if (process.env.ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "server",
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true,
        }),
      );
    }

    return config;
  },
  async headers() {
    return [
      {
        source: "/:all*(jpg|jpeg|gif|png|webp|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  images: {
    // domains: [
    //   "ipfs.io",
    //   "s2.coinmarketcap.com",
    //   "raw.githubusercontent.com",
    //   "celoscan.io",
    // ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  transpilePackages: ["@0xsquid/widget"],
};

module.exports = nextConfig;
