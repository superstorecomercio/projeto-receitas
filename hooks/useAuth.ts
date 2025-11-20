"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Só executar no cliente
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    let mounted = true;

    // Verificar usuário atual
    checkUser();

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    // Timeout de segurança para garantir que loading não fique travado
    const timeout = setTimeout(() => {
      if (mounted) {
        setLoading(false);
      }
    }, 3000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUser = async () => {
    try {
      // Verificar se estamos no cliente
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      
      if (error) {
        // Ignorar erros de sessão ausente (normal quando não logado)
        if (error.message?.includes('session') || error.message?.includes('Auth session missing')) {
          setUser(null);
        } else {
          console.error('Erro ao verificar usuário:', error);
          setUser(null);
        }
      } else {
        setUser(user);
      }
    } catch (error: unknown) {
      // Ignorar erros de sessão ausente
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('session') || errorMessage.includes('Auth session missing')) {
        setUser(null);
      } else {
        console.error('Erro inesperado ao verificar usuário:', error);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return { user, loading };
}

