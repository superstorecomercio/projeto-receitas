-- ============================================
-- Queries de Teste e Verificação
-- Use estas queries para verificar se tudo está configurado corretamente
-- ============================================

-- 1. Verificar se as tabelas foram criadas
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'recipes')
ORDER BY table_name;

-- 2. Verificar estrutura da tabela profiles
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. Verificar estrutura da tabela recipes
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'recipes'
ORDER BY ordinal_position;

-- 4. Verificar se RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'recipes');

-- 5. Verificar todas as políticas RLS criadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as command,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'recipes')
ORDER BY tablename, policyname;

-- 6. Verificar índices criados
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'recipes')
ORDER BY tablename, indexname;

-- ============================================
-- Teste de Inserção (apenas para usuários autenticados)
-- ============================================
-- Descomente e execute após fazer login no Supabase

/*
-- Teste: Inserir um profile de teste
INSERT INTO public.profiles (
    id,
    username,
    fullname
) VALUES (
    auth.uid(),
    'usuario_teste',
    'Usuário de Teste'
);

-- Teste: Inserir uma receita de teste
INSERT INTO public.recipes (
    userid,
    title,
    ingredients,
    instructions,
    cooking_time,
    difficulty,
    category
) VALUES (
    auth.uid(),
    'Receita de Teste',
    'Ingrediente 1, Ingrediente 2',
    'Passo 1: Faça isso. Passo 2: Faça aquilo.',
    30,
    'Fácil',
    'Teste'
);

-- Verificar se os dados foram inseridos
SELECT * FROM public.profiles WHERE username = 'usuario_teste';
SELECT * FROM public.recipes WHERE title = 'Receita de Teste';

-- Limpar testes (opcional)
-- DELETE FROM public.recipes WHERE title = 'Receita de Teste';
-- DELETE FROM public.profiles WHERE username = 'usuario_teste';
*/

