"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Gerar username automaticamente a partir do email
      const username = email.split('@')[0] + '_' + Date.now().toString().slice(-4);

      const { data, error: signUpError } = await signUp(
        email,
        password,
        username
      );

      if (signUpError) {
        setError(signUpError.message || "Erro ao criar conta");
        setLoading(false);
        return;
      }

      if (data?.user) {
        setSuccess(true);
        // Redirecionar após 2 segundos
        setTimeout(() => {
          router.push("/me/recipes");
          router.refresh();
        }, 2000);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro inesperado ao criar conta";
      console.error("Erro de signup:", err);
      setError(errorMessage);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Conta criada com sucesso!</h2>
            <p className="text-gray-600 mb-4">
              Verifique seu email para confirmar a conta.
            </p>
            <p className="text-sm text-gray-500">Redirecionando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🍳</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                CookShare
              </span>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Crie sua conta
            </h2>
            <p className="text-gray-600">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="font-semibold text-orange-600 hover:text-orange-700 transition-colors"
              >
                Entre aqui
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-800 font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">📧</span>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔒</span>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Mínimo de 6 caracteres
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⏳</span>
                  Criando conta...
                </span>
              ) : (
                "Criar conta"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

