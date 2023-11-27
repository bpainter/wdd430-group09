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
        hostname: '*.githubusercontent.com',
        port: '',
        pathname: '**',
      },
      { 
        protocol: 'https', 
        hostname: 'tailwindui.com',
        port: '',
        pathname: '/img/logos/**',
      },
    ],
  },
}

module.exports = nextConfig;
