"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { updateRecipe } from "@/lib/recipes";
import type { Database } from "@/types/database";

type Recipe = Database["public"]["Tables"]["recipes"]["Row"];

const difficulties = ["Fácil", "Médio", "Difícil"];
const categories = [
  "Pratos Principais",
  "Sobremesas",
  "Entradas",
  "Saladas",
  "Bebidas",
];

function EditRecipeForm() {
  const router = useRouter();
  const params = useParams();
  const recipeId = params.id as string;
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [cookingTime, setCookingTime] = useState(30);
  const [difficulty, setDifficulty] = useState(difficulties[0]);
  const [category, setCategory] = useState(categories[0]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", recipeId)
        .single();

      if (error || !data) {
        setError("Receita não encontrada.");
        setLoading(false);
        return;
      }

      setRecipe(data as Recipe);
      setTitle(data.title);
      setIngredients(data.ingredients || "");
      setInstructions(data.instructions || "");
      setCookingTime(data.cooking_time);
      setDifficulty(data.difficulty);
      setCategory(data.category);
      setLoading(false);
    };

    fetchRecipe();
  }, [recipeId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const { data, error } = await updateRecipe(recipeId, {
        title,
        ingredients,
        instructions,
        cooking_time: cookingTime,
        difficulty,
        category,
      });

      if (error) {
        setError(error.message || "Erro ao atualizar receita");
        setSaving(false);
        return;
      }

      if (data?.id) {
        router.push(`/recipes/${recipeId}`);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Erro inesperado ao atualizar receita");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando receita...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">{error || "Receita não encontrada."}</p>
      </div>
    );
  }

  if (user && recipe.userid !== user.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="rounded-2xl bg-white p-8 shadow-sm text-center">
          <p className="text-gray-700">
            Você não tem permissão para editar esta receita.
          </p>
          <Link
            href="/me/recipes"
            className="mt-4 inline-block rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
          >
            Minhas receitas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Editar Receita</h1>
          <Link
            href={`/recipes/${recipeId}`}
            className="text-sm text-gray-600 hover:text-black transition-colors"
          >
            ← Voltar para receita
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tempo de Preparo (minutos)
                </label>
                <input
                  type="number"
                  min={1}
                  value={cookingTime}
                  onChange={(e) => setCookingTime(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dificuldade
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                >
                  {difficulties.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                >
                  {categories.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ingredientes
              </label>
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                required
                rows={5}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Instruções
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Link
                href={`/recipes/${recipeId}`}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function EditRecipePage() {
  return (
    <ProtectedRoute>
      <EditRecipeForm />
    </ProtectedRoute>
  );
}

