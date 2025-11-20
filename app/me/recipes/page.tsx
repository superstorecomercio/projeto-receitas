"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { getAllRecipes } from "@/lib/recipes";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import type { Database } from "@/types/database";

type Recipe = Database["public"]["Tables"]["recipes"]["Row"];

function MyRecipesContent() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Todas");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const difficulties = ["Todas", "Fácil", "Médio", "Difícil"];
  const categories = ["Todas", "Pratos Principais", "Sobremesas", "Entradas", "Saladas", "Bebidas"];

  useEffect(() => {
    if (user) {
      loadRecipes();
    }
  }, [user]);

  useEffect(() => {
    if (recipes) {
      filterRecipes();
    }
  }, [recipes, searchTerm, selectedDifficulty, selectedCategory]);

  const loadRecipes = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error: recipesError } = await getAllRecipes();

    if (recipesError) {
      setError(recipesError);
      setLoading(false);
    } else {
      setRecipes(data);
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    if (!recipes) return;

    let filtered = [...recipes];

    // Filtrar por busca
    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por dificuldade
    if (selectedDifficulty !== "Todas") {
      filtered = filtered.filter(recipe => recipe.difficulty === selectedDifficulty);
    }

    // Filtrar por categoria
    if (selectedCategory !== "Todas") {
      filtered = filtered.filter(recipe => recipe.category === selectedCategory);
    }

    setFilteredRecipes(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black mx-auto"></div>
          <p className="text-gray-600">Carregando receitas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard de Receitas</h1>
            <p className="mt-2 text-gray-600">
              Explore receitas da comunidade e gerencie as suas
            </p>
          </div>
          <Link
            href="/recipes/new"
            className="rounded-md bg-black px-6 py-3 text-white hover:bg-gray-800 transition-colors"
          >
            Nova Receita
          </Link>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Campo de Busca */}
            <div className="md:col-span-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar receitas
              </label>
              <input
                id="search"
                type="text"
                placeholder="Buscar por título ou ingrediente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black px-4 py-2 border"
              />
            </div>

            {/* Filtro de Categoria */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black px-4 py-2 border"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro de Dificuldade */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                Dificuldade
              </label>
              <select
                id="difficulty"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black px-4 py-2 border"
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contador de Resultados */}
          {filteredRecipes && (
            <div className="mt-4 text-sm text-gray-600">
              {filteredRecipes.length} {filteredRecipes.length === 1 ? 'receita encontrada' : 'receitas encontradas'}
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">
              Erro ao carregar receitas: {error?.message || "Erro desconhecido"}
            </p>
          </div>
        )}

        {filteredRecipes && filteredRecipes.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow-md">
            <p className="text-gray-500 mb-4">
              {recipes && recipes.length === 0
                ? "Ainda não há receitas cadastradas. Seja o primeiro a compartilhar!"
                : "Nenhuma receita encontrada com os filtros selecionados."}
            </p>
            {recipes && recipes.length === 0 && (
              <Link
                href="/recipes/new"
                className="inline-block rounded-md bg-black px-6 py-3 text-white hover:bg-gray-800 transition-colors"
              >
                Criar Primeira Receita
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes?.map((recipe) => {
              const isOwner = user?.id === recipe.userid;

              return (
                <div
                  key={recipe.id}
                  className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
                >
                  {isOwner && (
                    <div className="absolute top-3 right-3 z-10 rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                      Sua receita
                    </div>
                  )}

                  <Link href={`/recipes/${recipe.id}`} className="block">
                    <div className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                          {recipe.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {recipe.cooking_time} min
                        </span>
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-black transition-colors">
                        {recipe.title}
                      </h3>
                      <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                        {recipe.ingredients
                          ? `${recipe.ingredients.substring(0, 100)}...`
                          : "Sem descrição"}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Dificuldade: {recipe.difficulty}
                        </span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          Criado por{" "}
                          <span className="font-medium text-gray-700">
                            {(recipe as Recipe & { profiles?: { fullname?: string | null } }).profiles?.fullname || "Anônimo"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default function MyRecipesPage() {
  return (
    <ProtectedRoute>
      <MyRecipesContent />
    </ProtectedRoute>
  );
}

