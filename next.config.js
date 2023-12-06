/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['tailwindui.com', 'loremflickr.com', 'avatars.githubusercontent.com', 'cloudflare-ipfs.com', 'media.discordapp.net'],
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
        hostname: 'loremflickr.com',
        port: '',
        pathname: '**',
      },
    ],
  },
}

module.exports = nextConfig;
