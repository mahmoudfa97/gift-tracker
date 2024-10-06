/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Enable static export
    basePath: '/your-repo-name', // Set the GitHub repository name as the base path
    assetPrefix: '/your-repo-name/', // Prefix for assets (styles, scripts, etc.)
  }
  
  module.exports = nextConfig