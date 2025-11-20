"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DebugPage() {
  const [checks, setChecks] = useState<{
    envUrl: boolean;
    envKey: boolean;
    urlFormat: boolean;
    connection: string;
    authTest: string;
  }>({
    envUrl: false,
    envKey: false,
    urlFormat: false,
    connection: "Testando...",
    authTest: "Testando...",
  });

  useEffect(() => {
    const runChecks = async () => {
      // Verificar variáveis de ambiente
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      setChecks((prev) => ({
        ...prev,
        envUrl: !!url,
        envKey: !!key,
        urlFormat: url ? url.startsWith("https://") : false,
      }));

      // Testar conexão básica
      try {
        const { data, error } = await supabase.from("profiles").select("count").limit(1);
        
        if (error) {
          setChecks((prev) => ({
            ...prev,
            connection: `Erro: ${error.message}`,
          }));
        } else {
          setChecks((prev) => ({
            ...prev,
            connection: "✅ Conexão OK",
          }));
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
        setChecks((prev) => ({
          ...prev,
          connection: `❌ Erro de conexão: ${errorMessage}`,
        }));
      }

      // Testar autenticação
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setChecks((prev) => ({
            ...prev,
            authTest: `Erro: ${error.message}`,
          }));
        } else {
          setChecks((prev) => ({
            ...prev,
            authTest: "✅ Auth OK (sem sessão ativa)",
          }));
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
        setChecks((prev) => ({
          ...prev,
          authTest: `❌ Erro de auth: ${errorMessage}`,
        }));
      }
    };

    runChecks();
  }, []);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Debug - Configuração Supabase</h1>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Verificações:</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL configurada:</span>
              <span className={checks.envUrl ? "text-green-600" : "text-red-600"}>
                {checks.envUrl ? "✅ Sim" : "❌ Não"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY configurada:</span>
              <span className={checks.envKey ? "text-green-600" : "text-red-600"}>
                {checks.envKey ? "✅ Sim" : "❌ Não"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">Formato da URL (https://):</span>
              <span className={checks.urlFormat ? "text-green-600" : "text-red-600"}>
                {checks.urlFormat ? "✅ Correto" : "❌ Incorreto"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">Teste de conexão:</span>
              <span className="text-sm">{checks.connection}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">Teste de autenticação:</span>
              <span className="text-sm">{checks.authTest}</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold mb-2">Informações (parciais):</h3>
            <div className="space-y-2 text-sm">
              <div>
                <strong>URL:</strong> {url ? `${url.substring(0, 30)}...` : "Não configurada"}
              </div>
              <div>
                <strong>Key (primeiros caracteres):</strong>{" "}
                {key ? `${key.substring(0, 20)}...` : "Não configurada"}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded">
            <h3 className="font-semibold mb-2">Como corrigir:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Acesse o Vercel Dashboard</li>
              <li>Vá em Settings → Environment Variables</li>
              <li>Adicione NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              <li>Selecione os ambientes (Production, Preview, Development)</li>
              <li>Faça um novo deploy</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

