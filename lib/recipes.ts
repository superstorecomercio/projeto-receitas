import { supabaseServer } from './supabase-server';
import { supabase } from './supabaseClient';
import type { Database } from '@/types/database';

type Recipe = Database['public']['Tables']['recipes']['Row'];
type RecipeInsert = Database['public']['Tables']['recipes']['Insert'];
type RecipeUpdate = Database['public']['Tables']['recipes']['Update'];

/**
 * Busca todas as receitas (público) - usa cliente do servidor
 */
export async function getAllRecipes() {
  // Buscar receitas
  const { data: recipes, error: recipesError } = await supabaseServer
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false });

  if (recipesError) {
    return { data: null, error: recipesError };
  }

  if (!recipes || recipes.length === 0) {
    return { data: [], error: null };
  }

  // TypeScript agora sabe que recipes é um array não-vazio
  const recipesArray: Recipe[] = recipes;

  // Buscar IDs únicos de usuários
  const userIds = [...new Set(recipesArray.map((r) => r.userid))];

  // Buscar perfis dos usuários
  const { data: profiles, error: profilesError } = await supabaseServer
    .from('profiles')
    .select('id, username, fullname, bio')
    .in('id', userIds);

  if (profilesError) {
    return { data: recipesArray, error: null }; // Retorna receitas mesmo sem perfis
  }

  // Criar mapa de perfis por ID
  const profilesMap = new Map((profiles || []).map((p) => [p.id, p]));

  // Combinar receitas com perfis
  const recipesWithProfiles = recipesArray.map((recipe) => ({
    ...recipe,
    profiles: profilesMap.get(recipe.userid) || null
  }));

  return { data: recipesWithProfiles, error: null };
}

/**
 * Busca receitas por usuário - usa cliente do servidor
 */
export async function getRecipesByUser(userId: string) {
  const { data, error } = await supabaseServer
    .from('recipes')
    .select('*')
    .eq('userid', userId)
    .order('created_at', { ascending: false });

  return { data, error };
}

/**
 * Busca uma receita por ID - usa cliente do servidor
 */
export async function getRecipeById(id: string) {
  const { data, error } = await supabaseServer
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
}

/**
 * Busca receitas por categoria - usa cliente do servidor
 */
export async function getRecipesByCategory(category: string) {
  const { data, error } = await supabaseServer
    .from('recipes')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  return { data, error };
}

/**
 * Busca receitas por dificuldade - usa cliente do servidor
 */
export async function getRecipesByDifficulty(difficulty: string) {
  const { data, error } = await supabaseServer
    .from('recipes')
    .select('*')
    .eq('difficulty', difficulty)
    .order('created_at', { ascending: false });

  return { data, error };
}

/**
 * Busca receitas por título (busca parcial) - usa cliente do servidor
 */
export async function searchRecipesByTitle(searchTerm: string) {
  const { data, error } = await supabaseServer
    .from('recipes')
    .select('*')
    .ilike('title', `%${searchTerm}%`)
    .order('created_at', { ascending: false });

  return { data, error };
}

/**
 * Cria uma nova receita
 */
export async function createRecipe(recipe: Omit<RecipeInsert, 'userid'>) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: userError || new Error('Usuário não autenticado') };
  }

  const recipeData: RecipeInsert = {
    ...recipe,
    userid: user.id,
  };

  const { data, error } = await supabase
    .from('recipes')
    // @ts-expect-error - Supabase type issue
    .insert(recipeData)
    .select()
    .single();

  return { data, error };
}

/**
 * Atualiza uma receita (apenas se for do usuário atual)
 */
export async function updateRecipe(id: string, updates: RecipeUpdate) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: userError || new Error('Usuário não autenticado') };
  }

  const { data, error } = await supabase
    .from('recipes')
    // @ts-expect-error - Supabase type issue
    .update(updates)
    .eq('id', id)
    .eq('userid', user.id) // Garante que só atualiza se for do usuário
    .select()
    .single();

  return { data, error };
}

/**
 * Deleta uma receita (apenas se for do usuário atual)
 */
export async function deleteRecipe(id: string) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: userError || new Error('Usuário não autenticado') };
  }

  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id)
    .eq('userid', user.id); // Garante que só deleta se for do usuário

  return { error };
}

