import Link from "next/link";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center justify-center mb-6">
              <span className="text-6xl animate-bounce">👨‍🍳</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent">
              Compartilhe suas receitas favoritas
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-xl text-purple-100 sm:text-2xl leading-relaxed">
              Descubra novas receitas, compartilhe suas criações culinárias e
              construa sua coleção de favoritos
            </p>
            <div className="mt-12 flex items-center justify-center gap-4">
              <Link
                href="/login"
                className="group relative rounded-xl bg-white px-8 py-4 text-base font-semibold text-purple-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <span className="relative z-10">Começar agora</span>
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Como funciona</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Crie uma conta, compartilhe suas receitas e gerencie tudo em um dashboard completo.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="group relative rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Compartilhe receitas</h3>
            <p className="text-gray-600 leading-relaxed">
              Adicione ingredientes, instruções e tempo de preparo com facilidade.
            </p>
          </div>
          
          <div className="group relative rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Dashboard completo</h3>
            <p className="text-gray-600 leading-relaxed">
              Visualize receitas suas e de toda a comunidade em um só lugar.
            </p>
          </div>
          
          <div className="group relative rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Favoritos</h3>
            <p className="text-gray-600 leading-relaxed">
              Salve receitas para acessar rapidamente no dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <span className="text-lg">🍳</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                CookShare
              </span>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 CookShare. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
