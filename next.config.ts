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
        source: '/pos/terminal',
        destination: '/pos/pos-terminal',
        permanent: false,
      },
      {
        source: '/pos/checkout-register',
        destination: '/pos/pos-terminal',
        permanent: false,
      },
      {
        source: '/pos/access',
        destination: '/pos/security',
        permanent: false,
      },
      {
        source: '/pos/kds',
        destination: '/pos/kitchen-display',
        permanent: false,
      },
      {
        source: '/pos/stock',
        destination: '/pos/stock-warehouses',
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
      {
        source: '/CodeBridgesOnboardingLaunchpad',
        destination: '/launchpad',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
