"use client";

import Link from "next/link";
import AuthButton from "./AuthButton";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href={user ? "/me/recipes" : "/"} className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-black">CookShare</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <AuthButton />
          </nav>
        </div>
      </div>
    </header>
  );
}

