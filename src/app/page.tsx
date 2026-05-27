import Header from "@/components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Plano 500
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-xl mb-8">
          O plano definitivo para quem quer resultados reais. Conteúdo exclusivo, estratégias validadas e acesso à comunidade.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/checkout"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-lg hover:scale-105 transition"
          >
            Quero Acessar — R$ 30
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 rounded-full border border-white/20 text-white font-bold text-lg hover:bg-white/10 transition"
          >
            Já sou membro
          </Link>
        </div>
      </section>
    </main>
  );
}
