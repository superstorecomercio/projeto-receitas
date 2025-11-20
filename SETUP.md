# Setup do Projeto CookShare

## 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Como obter essas credenciais:

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Settings** > **API**
4. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Estrutura Criada

### Arquivos de Configuração

- `lib/supabaseClient.ts` - Cliente do Supabase configurado
- `types/database.ts` - Tipos TypeScript para as tabelas do banco
- `lib/auth.ts` - Funções utilitárias para autenticação
- `lib/recipes.ts` - Funções utilitárias para gerenciar receitas

### Funções Disponíveis

#### Autenticação (`lib/auth.ts`)
- `signUp(email, password, username, fullname?)` - Criar conta
- `signIn(email, password)` - Fazer login
- `signOut()` - Fazer logout
- `getCurrentUser()` - Obter usuário atual
- `getCurrentProfile()` - Obter profile do usuário atual
- `updateProfile(updates)` - Atualizar profile
- `resetPassword(email)` - Redefinir senha

#### Receitas (`lib/recipes.ts`)
- `getAllRecipes()` - Buscar todas as receitas
- `getRecipesByUser(userId)` - Buscar receitas de um usuário
- `getRecipeById(id)` - Buscar receita por ID
- `getRecipesByCategory(category)` - Buscar por categoria
- `getRecipesByDifficulty(difficulty)` - Buscar por dificuldade
- `searchRecipesByTitle(searchTerm)` - Buscar por título
- `createRecipe(recipe)` - Criar nova receita
- `updateRecipe(id, updates)` - Atualizar receita
- `deleteRecipe(id)` - Deletar receita

## 3. Próximos Passos

1. ✅ Instalar dependências do Supabase
2. ✅ Criar estrutura de arquivos
3. ⏳ Configurar variáveis de ambiente (você precisa fazer isso)
4. ⏳ Criar páginas de autenticação (login/signup)
5. ⏳ Implementar páginas de receitas
6. ⏳ Conectar homepage com dados reais do Supabase

## 4. Testar a Conexão

Após configurar as variáveis de ambiente, você pode testar a conexão criando uma página de teste ou usando o console do navegador:

```typescript
import { supabase } from '@/lib/supabaseClient';

// Testar conexão
const { data, error } = await supabase.from('recipes').select('*').limit(1);
console.log('Conexão:', { data, error });
```

