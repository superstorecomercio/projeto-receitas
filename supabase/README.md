# Configuração do Banco de Dados Supabase

Este guia explica como configurar o banco de dados do CookShare no Supabase.

## Passo a Passo

### 1. Executar o Schema SQL

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor** no menu lateral
4. Clique em **New Query**
5. Copie e cole o conteúdo do arquivo `schema.sql`
6. Clique em **Run** (ou pressione Ctrl+Enter)

### 2. Verificar Configuração

Execute esta query para verificar se tudo foi criado corretamente:

```sql
-- Verificar tabelas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'recipes');

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'recipes');
```

## Estrutura das Tabelas

### Tabela `profiles`
- `id`: UUID (chave primária, referencia auth.users)
- `username`: Texto (único, obrigatório)
- `fullname`: Texto (opcional)
- `created_at`: Timestamp (data de criação)
- `updated_at`: Timestamp (data de atualização)

### Tabela `recipes`
- `id`: UUID (chave primária)
- `created_at`: Timestamp (data de criação)
- `userid`: UUID (referência ao usuário)
- `title`: Texto (título da receita)
- `ingredients`: Texto (ingredientes)
- `instructions`: Texto (instruções de preparo)
- `cooking_time`: Integer (tempo de cozimento em minutos)
- `difficulty`: Texto (dificuldade)
- `category`: Texto (categoria da receita)

## Segurança (RLS)

Todas as tabelas têm Row Level Security (RLS) habilitado:

- **Profiles**: Qualquer pessoa pode ler, mas apenas o dono pode criar/editar
- **Recipes**: Qualquer pessoa pode ler, mas apenas o dono pode criar/editar/deletar

## Próximos Passos

Após configurar o banco de dados:

1. Instalar o cliente Supabase no projeto Next.js
2. Configurar variáveis de ambiente
3. Criar utilitários para conexão com Supabase
4. Implementar autenticação
5. Implementar as páginas e funcionalidades

