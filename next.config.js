/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['raw.githubusercontent.com', 'assets.pokemon.com'],
    unoptimized: true, // Désactive l'optimisation d'image pour Netlify
  },
  // Désactive le système de fichiers statiques pour utiliser le serveur Netlify
  output: 'standalone',
  // Active la compression Gzip et Brotli
  compress: true,
  // Active la génération de fichiers statiques pour Netlify
  target: 'serverless',
  // Configuration pour les redirections
  async redirects() {
    return [
      {
        source: '/',
        destination: '/pokemon',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
