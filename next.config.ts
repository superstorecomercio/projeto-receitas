import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações para compatibilidade com Vercel
  reactStrictMode: true,
  
  // Garantir compatibilidade com Node 18+
  experimental: {
    // Não usar features experimentais que possam quebrar no Vercel
  },
  
  // Configurações de TypeScript
  typescript: {
    // Não falhar no build se houver erros de tipo (mas avisar)
    ignoreBuildErrors: false,
  },
  
  // Configurações de ESLint
  eslint: {
    // Não falhar no build se houver erros de lint (mas avisar)
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
