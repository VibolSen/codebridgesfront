import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/inventory',
        destination: '/inventory/dashboard',
        permanent: false,
      },
      {
        source: '/pos',
        destination: '/pos/dashboard',
        permanent: false,
      },
      {
        source: '/super-admin',
        destination: '/super-admin/dashboard',
        permanent: false,
      },
      {
        source: '/hrm',
        destination: '/hrm/dashboard',
        permanent: false,
      },
      {
        source: '/accounting',
        destination: '/financial/dashboard',
        permanent: false,
      },
      {
        source: '/financial',
        destination: '/financial/dashboard',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
