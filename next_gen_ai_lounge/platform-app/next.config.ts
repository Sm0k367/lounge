import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurations for static export to GitHub Pages
  // Assumes the GitHub repository is named 'next_gen_ai_lounge'
  // If your repository has a different name, update basePath and assetPrefix accordingly.
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/next_gen_ai_lounge' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/next_gen_ai_lounge/' : '',

  // Add any other existing configurations here if necessary
  // For example, if there were 'images' or 'reactStrictMode' settings.
  /* config options here */
};

export default nextConfig;
