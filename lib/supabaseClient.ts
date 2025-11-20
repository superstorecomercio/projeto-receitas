import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validação mais rigorosa em produção
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = 'Missing Supabase environment variables. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel project settings.';
  
  if (typeof window !== 'undefined') {
    console.error('🔴 SUPABASE CONFIG ERROR:', errorMessage);
    console.error('URL configurada:', !!supabaseUrl);
    console.error('KEY configurada:', !!supabaseAnonKey);
  } else {
    console.error(errorMessage);
  }
  
  // Em produção, lançar erro se as variáveis não estiverem configuradas
  if (process.env.NODE_ENV === 'production' && (!supabaseUrl || !supabaseAnonKey)) {
    throw new Error(errorMessage);
  }
} else if (typeof window !== 'undefined') {
  console.log('✅ Supabase configurado:', {
    url: supabaseUrl?.substring(0, 30) + '...',
    keyConfigured: !!supabaseAnonKey,
  });
}

// Validar formato da URL
if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
  console.warn('NEXT_PUBLIC_SUPABASE_URL should start with https://');
}

// Criar cliente Supabase
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

