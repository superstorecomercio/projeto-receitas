"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { deleteRecipe } from "@/lib/recipes";
import type { Database } from "@/types/database";

type Recipe = Database["public"]["Tables"]["recipes"]["Row"];

export default function RecipePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const recipeId = params.id as string;

  useEffect(() => {
    loadRecipe();
  }, [recipeId]);

  const loadRecipe = async () => {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("id", recipeId)
      .single();

    if (error || !data) {
      router.push("/me/recipes");
      return;
    }

    setRecipe(data as Recipe);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja deletar esta receita?")) {
      return;
    }

    setDeleting(true);
    const { error } = await deleteRecipe(recipeId);

    if (error) {
      alert("Erro ao deletar receita: " + error.message);
      setDeleting(false);
    } else {
      router.push("/me/recipes");
    }
  };

  if (loading || !recipe) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black mx-auto"></div>
          <p className="text-gray-600">Carregando receita...</p>
        </div>
      </div>
    );
  }

  const formattedIngredients = recipe.ingredients
    ? recipe.ingredients.split("\n").filter(Boolean)
    : [];
  const formattedInstructions = recipe.instructions
    ? recipe.instructions.split("\n").filter(Boolean)
    : [];

  const isOwner = user?.id === recipe.userid;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/me/recipes" className="text-sm text-gray-600 hover:text-black">
            ← Voltar para Dashboard
          </Link>
          {isOwner && (
            <div className="flex gap-3">
              <Link
                href={`/recipes/${recipe.id}/edit`}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Editar
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deletando..." : "Deletar"}
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <article className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
              {recipe.category}
            </span>
            <span>Tempo de preparo: {recipe.cooking_time} min</span>
            <span>Dificuldade: {recipe.difficulty}</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">{recipe.title}</h1>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Ingredientes
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700">
              {formattedIngredients.length > 0 ? (
                formattedIngredients.map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              ) : (
                <li>Nenhum ingrediente listado.</li>
              )}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Passo a passo
            </h2>
            <ol className="mt-4 space-y-4 text-gray-700">
              {formattedInstructions.length > 0 ? (
                formattedInstructions.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="font-semibold text-gray-900">
                      {index + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))
              ) : (
                <li>Nenhuma instrução fornecida.</li>
              )}
            </ol>
          </section>
        </article>
      </main>
    </div>
  );
}



