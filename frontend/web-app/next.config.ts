import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  logging: {
    fetches :{
      fullUrl:true
    }
  },
  images: {
    remotePatterns: [new URL('https://cdn.pixabay.com/photo/**')],
  },
  output: "standalone",
  // Ensure proper handling of static assets in Docker
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // Disable x-powered-by header for security
  poweredByHeader: false,
  // Ensure proper handling of trailing slashes
  trailingSlash: false,
};

export default withFlowbiteReact(nextConfig);