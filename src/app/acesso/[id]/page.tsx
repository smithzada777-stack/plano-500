"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AcessoGuard from "@/components/AcessoGuard";
import TopBar from "@/components/TopBar";
import { storage } from "@/lib/storage";
import type { Module, User } from "@/lib/types";
import { ArrowLeft, ExternalLink, FileText, Image as ImgIcon } from "lucide-react";

function ModuloContent({ user }: { user: User }) {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [moduleData, setModuleData] = useState<Module | null>(null);

  useEffect(() => {
    const all = storage.listModules();
    const m = all.find((x) => x.id === params.id) || null;
    if (!m || !m.visible) {
      router.replace("/acesso");
      return;
    }
    if (m.isExtra && !user.extraModuleIds?.includes(m.id)) {
      router.replace("/acesso");
      return;
    }
    setModuleData(m);
  }, [params.id, router, user]);

  if (!moduleData) return null;

  const toggleCheck = (cid: string) => {
    const all = storage.listModules();
    const m = all.find((x) => x.id === moduleData.id);
    if (!m) return;
    const c = m.checklist.find((x) => x.id === cid);
    if (!c) return;
    c.done = !c.done;
    storage.saveModules(all);
    setModuleData({ ...m });
  };

  return (
    <main className="min-h-screen flex flex-col">
      <TopBar userName={user.name} />

      <section className="flex-1 px-5 py-6 max-w-3xl mx-auto w-full">
        <button
          onClick={() => router.push("/acesso")}
          className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar às missões
        </button>

        <div className="mb-6">
          <span className="badge-gold mb-2">MISSÃO {moduleData.order}</span>
          <h1 className="text-2xl font-black mt-2">{moduleData.title}</h1>
          <p className="text-neutral-400 text-sm mt-2">{moduleData.description}</p>
        </div>

        {/* Conteúdos */}
        {moduleData.contents.length > 0 && (
          <div className="space-y-3 mb-6">
            <h2 className="text-sm font-bold uppercase text-neutral-500">Conteúdo</h2>
            {moduleData.contents.map((c, i) => (
              <div key={i} className="card">
                <p className="text-xs text-amber-400 font-semibold mb-1">{c.label}</p>
                {c.type === "text" && <p className="text-sm text-neutral-200 whitespace-pre-wrap">{c.value}</p>}
                {c.type === "link" && c.value && (
                  <a
                    href={c.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-400 hover:underline flex items-center gap-1.5"
                  >
                    {c.value}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {c.type === "pdf" && (
                  <div className="flex items-center gap-2 text-sm text-neutral-300">
                    <FileText className="w-4 h-4 text-red-400" />
                    {c.value ? (
                      <a href={c.value} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                        Baixar PDF
                      </a>
                    ) : (
                      <span className="text-neutral-500">PDF em breve</span>
                    )}
                  </div>
                )}
                {c.type === "image" && c.value && (
                  <div className="flex items-center gap-2 text-sm text-neutral-300">
                    <ImgIcon className="w-4 h-4 text-blue-400" />
                    <a href={c.value} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                      Ver imagem
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Checklist */}
        {moduleData.checklist.length > 0 && (
          <div className="card">
            <h2 className="text-sm font-bold uppercase text-neutral-500 mb-3">Checklist</h2>
            <div className="space-y-2">
              {moduleData.checklist.map((c) => (
                <button
                  key={c.id}
                  onClick={() => toggleCheck(c.id)}
                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-800 transition text-left"
                >
                  <div
                    className={`w-5 h-5 rounded border-2 shrink-0 mt-0.5 flex items-center justify-center transition ${
                      c.done ? "bg-green-500 border-green-500" : "border-neutral-600"
                    }`}
                  >
                    {c.done && <span className="text-black text-xs font-black">✓</span>}
                  </div>
                  <span className={`text-sm ${c.done ? "line-through text-neutral-500" : "text-neutral-200"}`}>
                    {c.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default function ModuloPage() {
  return <AcessoGuard>{(user) => <ModuloContent user={user} />}</AcessoGuard>;
}
