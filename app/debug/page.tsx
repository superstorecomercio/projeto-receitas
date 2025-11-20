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
          // Verificar se o erro é HTML (indica URL errada)
          const errorMsg = error.message || "";
          if (errorMsg.includes("<!DOCTYPE") || errorMsg.includes("<html")) {
            setChecks((prev) => ({
              ...prev,
              connection: `❌ URL INCORRETA: A URL do Supabase está apontando para o site errado. Verifique se a URL no Vercel está correta (deve terminar com .supabase.co)`,
            }));
          } else {
            setChecks((prev) => ({
              ...prev,
              connection: `Erro: ${errorMsg.substring(0, 100)}`,
            }));
          }
        } else {
          setChecks((prev) => ({
            ...prev,
            connection: "✅ Conexão OK",
          }));
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
        // Verificar se é HTML
        if (typeof errorMessage === "string" && (errorMessage.includes("<!DOCTYPE") || errorMessage.includes("<html"))) {
          setChecks((prev) => ({
            ...prev,
            connection: `❌ URL INCORRETA: A resposta é HTML ao invés de JSON. A URL do Supabase está errada no Vercel.`,
          }));
        } else {
          setChecks((prev) => ({
            ...prev,
            connection: `❌ Erro de conexão: ${errorMessage.substring(0, 100)}`,
          }));
        }
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
                <strong>URL completa:</strong>{" "}
                <code className="bg-white px-2 py-1 rounded text-xs break-all">
                  {url || "Não configurada"}
                </code>
              </div>
              <div>
                <strong>URL começa com https://:</strong>{" "}
                {url ? (url.startsWith("https://") ? "✅ Sim" : "❌ Não") : "N/A"}
              </div>
              <div>
                <strong>URL contém 'supabase.co':</strong>{" "}
                {url ? (url.includes("supabase.co") ? "✅ Sim" : "❌ Não - PROBLEMA!") : "N/A"}
              </div>
              <div>
                <strong>Key configurada:</strong>{" "}
                {key ? `✅ Sim (${key.length} caracteres)` : "❌ Não"}
              </div>
            </div>
          </div>

          {url && !url.includes("supabase.co") && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
              <h3 className="font-semibold text-red-800 mb-2">⚠️ PROBLEMA DETECTADO:</h3>
              <p className="text-sm text-red-700">
                A URL do Supabase não contém "supabase.co". Isso indica que a URL está incorreta.
                A URL deve ser algo como: <code>https://xxxxx.supabase.co</code>
              </p>
              <p className="text-sm text-red-700 mt-2">
                <strong>URL atual:</strong> <code>{url}</code>
              </p>
            </div>
          )}

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

