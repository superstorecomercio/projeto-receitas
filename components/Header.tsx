"use client";

import Link from "next/link";
import AuthButton from "./AuthButton";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link 
            href={user ? "/me/recipes" : "/"} 
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white font-bold text-xl">🍳</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              CookShare
            </span>
          </Link>
          <nav className="flex items-center space-x-4">
            <AuthButton />
          </nav>
        </div>
      </div>
    </header>
  );
}

