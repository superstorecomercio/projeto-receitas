import Link from "next/link";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Compartilhe suas receitas favoritas
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 sm:text-xl">
              Descubra novas receitas, compartilhe suas criações culinárias e
              construa sua coleção de favoritos
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/login"
                className="rounded-md bg-white px-6 py-3 text-base font-semibold text-black hover:bg-gray-100 transition-colors"
              >
                Começar agora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Como funciona</h2>
          <p className="mt-2 text-gray-600">
            Crie uma conta, compartilhe suas receitas e gerencie tudo em um dashboard completo.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Compartilhe receitas</h3>
            <p className="mt-2 text-sm text-gray-600">
              Adicione ingredientes, instruções e tempo de preparo com facilidade.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Dashboard completo</h3>
            <p className="mt-2 text-sm text-gray-600">
              Visualize receitas suas e de toda a comunidade em um só lugar.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Favoritos</h3>
            <p className="mt-2 text-sm text-gray-600">
              Salve receitas para acessar rapidamente no dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 CookShare. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
