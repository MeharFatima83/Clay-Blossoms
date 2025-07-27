/** @type {import('next').NextConfig} */
const nextConfig = {};

export default {
  async rewrites() {
    return [
      {
        source: '/api/products/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_API}/api/products/:path*`,
      },
    ];
  },
};
