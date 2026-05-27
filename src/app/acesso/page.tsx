"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AcessoGuard from "@/components/AcessoGuard";
import TopBar from "@/components/TopBar";
import { storage } from "@/lib/storage";
import type { Module, User } from "@/lib/types";
import { CheckCircle2, Lock, ChevronRight, Trophy } from "lucide-react";

function AcessoContent({ user }: { user: User }) {
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    const all = storage.listModules();
    // visíveis + extras liberados ao usuário
    const visible = all.filter(
      (m) => m.visible && (!m.isExtra || user.extraModuleIds?.includes(m.id))
    );
    visible.sort((a, b) => a.order - b.order);
    setModules(visible);
  }, [user]);

  const total = modules.length;
  const completed = modules.filter((m) =>
    m.checklist.length > 0 && m.checklist.every((c) => c.done)
  ).length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <main className="min-h-screen flex flex-col">
      <TopBar userName={user.name} />

      <section className="flex-1 px-5 py-6 max-w-3xl mx-auto w-full">
        {/* Boas-vindas */}
        <div className="card mb-5 bg-gradient-to-br from-green-600/20 to-green-900/10 border-green-700/40">
          <span className="badge-gold mb-2">SEU ACESSO</span>
          <h1 className="text-2xl font-black mt-2">Bem-vindo ao Plano 500</h1>
          <p className="text-sm text-neutral-300 mt-1">
            Olá, {user.name}. Conclua as missões na ordem para extrair o máximo do plano.
          </p>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-neutral-400">Progresso</span>
              <span className="font-bold text-amber-400">{completed}/{total} missões</span>
            </div>
            <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
              <div className="h-full bg-amber-500 transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        {/* Lista de missões */}
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Suas missões
        </h2>

        <div className="space-y-3">
          {modules.map((m) => {
            const allDone = m.checklist.length > 0 && m.checklist.every((c) => c.done);
            return (
              <Link
                key={m.id}
                href={`/acesso/${m.id}`}
                className="card flex items-center gap-4 hover:border-green-600 transition group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-black shrink-0 ${
                    allDone
                      ? "bg-green-500 text-black"
                      : "bg-neutral-800 text-neutral-300"
                  }`}
                >
                  {allDone ? <CheckCircle2 className="w-6 h-6" /> : m.order}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{m.title}</p>
                  <p className="text-xs text-neutral-400 line-clamp-1">{m.description}</p>
                  {m.isExtra && (
                    <span className="inline-block mt-1 text-[10px] uppercase font-bold text-amber-400">
                      Bônus
                    </span>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-white shrink-0" />
              </Link>
            );
          })}

          {modules.length === 0 && (
            <div className="card text-center py-10">
              <Lock className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
              <p className="text-neutral-400 text-sm">Nenhuma missão liberada ainda.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function AcessoPage() {
  return <AcessoGuard>{(user) => <AcessoContent user={user} />}</AcessoGuard>;
}
