/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['tailwindui.com', 'loremflickr.com', 'avatars.githubusercontent.com'],
    remotePatterns: [
      { 
        protocol: 'https', 
        hostname: 'tailwindui.com',
        port: '',
        pathname: '/img/logos/**',
      },
      { 
        protocol: 'https', 
        hostname: 'loremflickr.com',
        port: '',
        pathname: '**',
      },
    ],
  },
}

module.exports = nextConfig;
