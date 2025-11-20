"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createRecipe } from "@/lib/recipes";
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

function NewRecipeForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [cookingTime, setCookingTime] = useState(30);
  const [difficulty, setDifficulty] = useState(difficulties[0]);
  const [category, setCategory] = useState(categories[0]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await createRecipe({
        title,
        ingredients,
        instructions,
        cooking_time: cookingTime,
        difficulty,
        category,
      });
      const createdRecipe = data as Recipe | null;

      if (error) {
        setError(error.message || "Erro ao criar receita");
        setLoading(false);
        return;
      }

      if (createdRecipe?.id) {
        router.push(`/recipes/${createdRecipe.id}`);
        router.refresh();
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro inesperado ao criar receita";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Nova Receita</h1>
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-black transition-colors"
          >
            Voltar para Home
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
                placeholder="Ex: Bolo de Chocolate"
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
                placeholder="Liste os ingredientes separados por linha"
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
                placeholder="Descreva o passo a passo da receita"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Link
                href="/"
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? "Salvando..." : "Salvar Receita"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function NewRecipePage() {
  return (
    <ProtectedRoute>
      <NewRecipeForm />
    </ProtectedRoute>
  );
}

