"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { isUserActive } from "@/lib/auth";
import Header from "@/components/Header";

export default function MembrosPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [active, setActive] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      isUserActive(user.uid).then((ok) => {
        setActive(ok);
        if (!ok) router.push("/checkout");
      });
    }
  }, [user, loading, router]);

  if (loading || active === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <section className="flex-1 px-6 py-12 max-w-5xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-2">Área de Membros</h1>
        <p className="text-gray-300 mb-8">Bem-vindo, {user?.displayName || user?.email}!</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-2 text-cyan-400">Módulo 1</h3>
            <p className="text-gray-300 text-sm">Introdução e fundamentos do Plano 500.</p>
            <button className="mt-4 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 text-sm hover:bg-cyan-500/30 transition">
              Acessar Conteúdo
            </button>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-2 text-cyan-400">Módulo 2</h3>
            <p className="text-gray-300 text-sm">Estratégias avançadas e casos reais.</p>
            <button className="mt-4 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 text-sm hover:bg-cyan-500/30 transition">
              Acessar Conteúdo
            </button>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-2 text-cyan-400">Módulo 3</h3>
            <p className="text-gray-300 text-sm">Automação e escala.</p>
            <button className="mt-4 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 text-sm hover:bg-cyan-500/30 transition">
              Acessar Conteúdo
            </button>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-2 text-cyan-400">Bônus</h3>
            <p className="text-gray-300 text-sm">Materiais extras e planilhas.</p>
            <button className="mt-4 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 text-sm hover:bg-cyan-500/30 transition">
              Acessar Conteúdo
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
