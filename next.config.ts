import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import rehypeSlug from "rehype-slug";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable MDX Support For .mdx Files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  experimental: {
    swcPlugins: [["@lingui/swc-plugin", {}]],
    turbo: {
      rules: {
        "*.po": {
          loaders: ["@lingui/loader"],
          as: "*.js",
        },
        "*.mdx": {
          loaders: ["@mdx-js/loader"],
          as: "*.js",
        },
      },
    },
    mdxRs: false,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.po$/,
      use: {
        loader: "@lingui/loader",
      },
    });

    return config;
  },
  async redirects() {
    return [
      {
        source: "/:locale/tax-calculator",
        destination: "/:locale/tax-visualizer",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/ph/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ph/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ph/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

// MDX Configuration With Rehype Plugins
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [rehypeSlug],
  },
});

export default withMDX(nextConfig);
