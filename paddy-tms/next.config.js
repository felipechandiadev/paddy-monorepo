/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable showing the "ready on" message which requires network interface detection
  experimental: {
    // Disable getting network hosts to avoid system errors in sandbox
  },
};

module.exports = nextConfig;
