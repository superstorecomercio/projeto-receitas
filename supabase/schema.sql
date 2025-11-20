-- ============================================
-- CookShare Database Schema - Simplificado
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- ============================================
-- 1. Criar tabela de profiles
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    fullname TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- 2. Criar tabela de receitas
-- ============================================
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    userid UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    cooking_time INTEGER NOT NULL,
    difficulty TEXT NOT NULL,
    category TEXT NOT NULL
);

-- Criar índices básicos
CREATE INDEX IF NOT EXISTS idx_recipes_userid ON public.recipes(userid);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON public.recipes(created_at DESC);

-- ============================================
-- 3. Habilitar Row Level Security (RLS)
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. Políticas RLS para tabela profiles
-- ============================================

-- Política: Qualquer pessoa pode ler profiles (público)
CREATE POLICY "Public read profiles" ON public.profiles
    FOR SELECT
    USING (true);

-- Política: Usuários podem criar seu próprio profile
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Política: Usuários podem atualizar apenas seu próprio profile
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ============================================
-- 5. Políticas RLS para tabela recipes
-- ============================================

-- Política: Qualquer pessoa pode ler receitas (público)
CREATE POLICY "Public read recipes" ON public.recipes
    FOR SELECT
    USING (true);

-- Política: Usuários autenticados podem criar receitas (apenas suas próprias)
CREATE POLICY "Users can insert own recipes" ON public.recipes
    FOR INSERT
    WITH CHECK (auth.uid() = userid);

-- Política: Usuários podem atualizar apenas suas próprias receitas
CREATE POLICY "Users can update own recipes" ON public.recipes
    FOR UPDATE
    USING (auth.uid() = userid)
    WITH CHECK (auth.uid() = userid);

-- Política: Usuários podem deletar apenas suas próprias receitas
CREATE POLICY "Users can delete own recipes" ON public.recipes
    FOR DELETE
    USING (auth.uid() = userid);

-- ============================================
-- FIM DO SCRIPT
-- ============================================

