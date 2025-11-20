"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

export default function AuthButton() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    // Redirecionar usando window.location para evitar interferência do ProtectedRoute
    window.location.href = "/";
  };

  // Sempre renderizar algo clicável, mesmo durante loading
  // O estado será atualizado quando o auth carregar
  if (user && !loading) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/me/recipes"
          className="text-gray-600 hover:text-black transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/profile"
          className="text-gray-600 hover:text-black transition-colors"
        >
          Perfil
        </Link>
        <button
          onClick={handleSignOut}
          className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 transition-colors"
        >
          Sair
        </button>
      </div>
    );
  }

  // Padrão: mostrar botões de login/signup
  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/login"
        className="text-gray-600 hover:text-black transition-colors"
      >
        Entrar
      </Link>
      <Link
        href="/signup"
        className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 transition-colors"
      >
        Cadastrar
      </Link>
    </div>
  );
}

