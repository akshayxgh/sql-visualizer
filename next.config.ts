import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config) => {
    // sql.js requires the wasm file to be served as a static asset.
    // This tells webpack not to try to bundle it.
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    }
    return config
  },
}

export default nextConfig