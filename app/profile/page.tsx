"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { getCurrentProfile, updateProfile } from "@/lib/auth";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

function ProfileContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    setLoading(true);
    const { profile: profileData, error: profileError } = await getCurrentProfile();

    if (profileError) {
      setError("Erro ao carregar perfil");
      setLoading(false);
      return;
    }

    if (profileData) {
      setProfile(profileData);
      setUsername(profileData.username || "");
      setFullname(profileData.fullname || "");
      setBio(profileData.bio || "");
      setEmail(user?.email || "");
    }
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      const { data, error: updateError } = await updateProfile({
        fullname: fullname || null,
        bio: bio || null,
      });

      if (updateError) {
        setError(updateError.message || "Erro ao atualizar perfil");
        setSaving(false);
        return;
      }

      setSuccess(true);
      setSaving(false);

      // Recarregar perfil
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro inesperado ao atualizar perfil";
      setError(errorMessage);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black mx-auto"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="mt-2 text-gray-600">
            Atualize seu nome completo e biografia
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <p className="text-sm text-green-800">
                  Perfil atualizado com sucesso!
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                O email não pode ser alterado
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome de usuário
              </label>
              <input
                type="text"
                value={username}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                O nome de usuário não pode ser alterado
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome completo
              </label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                placeholder="Seu nome completo (opcional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Biografia
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                placeholder="Conte um pouco sobre você e sua paixão pela culinária (opcional)"
              />
              <p className="mt-1 text-xs text-gray-500">
                Máximo de 500 caracteres
              </p>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push("/me/recipes")}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        </div>

        {profile && (
          <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informações da conta
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Conta criada em:</span>
                <span className="font-medium text-gray-900">
                  {new Date(profile.created_at).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Última atualização:</span>
                <span className="font-medium text-gray-900">
                  {new Date(profile.updated_at).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
