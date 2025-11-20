import { supabase } from './supabaseClient';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];

/**
 * Cria um novo usuário e seu profile
 */
export async function signUp(email: string, password: string, username: string, fullname?: string) {
  // Criar usuário no Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { data: null, error: authError };
  }

  if (!authData.user) {
    return { data: null, error: new Error('Usuário não foi criado') };
  }

  // Criar profile na tabela profiles
  const profileData: ProfileInsert = {
    id: authData.user.id,
    username,
    fullname: fullname || null,
  };

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    // @ts-expect-error - Supabase type issue
    .insert([profileData])
    .select()
    .single();

  if (profileError) {
    // Se falhar ao criar profile, o usuário ainda foi criado no auth
    // Você pode querer deletar o usuário do auth aqui se necessário
    return { data: null, error: profileError };
  }

  return { data: { user: authData.user, profile }, error: null };
}

/**
 * Faz login do usuário
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

/**
 * Faz logout do usuário
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Obtém o usuário atual
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { user, error };
}

/**
 * Obtém o profile do usuário atual
 */
export async function getCurrentProfile(): Promise<{ profile: Profile | null; error: any }> {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return { profile: null, error: userError };
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { profile, error };
}

/**
 * Atualiza o profile do usuário atual
 */
export async function updateProfile(updates: Partial<ProfileInsert>) {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return { data: null, error: userError || new Error('Usuário não autenticado') };
  }

  const { data, error } = await supabase
    .from('profiles')
    // @ts-expect-error - Supabase type issue
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select()
    .single();

  return { data, error };
}

/**
 * Redefine a senha do usuário
 */
export async function resetPassword(email: string, redirectUrl?: string) {
  const redirectTo = redirectUrl || (typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined);
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  return { data, error };
}

