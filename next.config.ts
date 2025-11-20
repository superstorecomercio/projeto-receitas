import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações para compatibilidade com Vercel
  reactStrictMode: true,
  
  // Configurações de TypeScript
  typescript: {
    // Não falhar no build se houver erros de tipo (mas avisar)
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
