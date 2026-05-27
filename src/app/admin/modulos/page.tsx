"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import AdminNav from "@/components/AdminNav";
import TopBar from "@/components/TopBar";
import { storage } from "@/lib/storage";
import type { Module, ModuleContent, ChecklistItem } from "@/lib/types";
import { Plus, Eye, EyeOff, Trash2, X, Save } from "lucide-react";

function ModulosContent() {
  const [modules, setModules] = useState<Module[]>([]);
  const [editing, setEditing] = useState<Module | null>(null);

  const reload = () => setModules([...storage.listModules()].sort((a, b) => a.order - b.order));
  useEffect(reload, []);

  const save = (m: Module) => {
    const all = storage.listModules();
    const idx = all.findIndex((x) => x.id === m.id);
    if (idx >= 0) all[idx] = m;
    else all.push(m);
    storage.saveModules(all);
    reload();
    setEditing(null);
  };

  const newModule = () => {
    const m: Module = {
      id: "m_" + Date.now(),
      order: modules.length + 1,
      title: "Nova missão",
      description: "",
      contents: [],
      checklist: [],
      visible: true,
      isExtra: false,
      createdAt: Date.now(),
    };
    setEditing(m);
  };

  const toggleVisible = (id: string) => {
    const all = storage.listModules();
    const m = all.find((x) => x.id === id);
    if (m) { m.visible = !m.visible; storage.saveModules(all); reload(); }
  };

  const remove = (id: string) => {
    if (!confirm("Excluir esta missão?")) return;
    storage.saveModules(storage.listModules().filter((x) => x.id !== id));
    reload();
  };

  return (
    <main className="min-h-screen flex flex-col">
      <TopBar variant="admin" userName="Admin" />
      <AdminNav />

      <section className="flex-1 px-5 py-6 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-black">Módulos</h1>
            <p className="text-sm text-neutral-400">{modules.length} missões</p>
          </div>
          <button onClick={newModule} className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nova
          </button>
        </div>

        <div className="space-y-2">
          {modules.map((m) => (
            <div key={m.id} className="card">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">#{m.order}</span>
                    {m.isExtra && <span className="badge-gold !text-[10px]">BÔNUS</span>}
                    {!m.visible && <span className="text-[10px] uppercase font-bold text-neutral-500">OCULTO</span>}
                  </div>
                  <p className="font-bold truncate">{m.title}</p>
                  <p className="text-xs text-neutral-400 line-clamp-2">{m.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setEditing(m)} className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-400">
                  Editar
                </button>
                <button onClick={() => toggleVisible(m.id)} className="text-xs px-3 py-1.5 rounded-lg bg-neutral-800 flex items-center gap-1">
                  {m.visible ? <><EyeOff className="w-3.5 h-3.5"/> Ocultar</> : <><Eye className="w-3.5 h-3.5"/> Mostrar</>}
                </button>
                <button onClick={() => remove(m.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {editing && <EditModuleModal module={editing} onClose={() => setEditing(null)} onSave={save} />}
    </main>
  );
}

function EditModuleModal({ module: m, onClose, onSave }: { module: Module; onClose: () => void; onSave: (m: Module) => void }) {
  const [data, setData] = useState<Module>(m);

  const addContent = () => setData({ ...data, contents: [...data.contents, { type: "text", label: "Novo bloco", value: "" }] });
  const updContent = (i: number, c: ModuleContent) => {
    const arr = [...data.contents]; arr[i] = c; setData({ ...data, contents: arr });
  };
  const delContent = (i: number) => setData({ ...data, contents: data.contents.filter((_, x) => x !== i) });

  const addCheck = () => setData({ ...data, checklist: [...data.checklist, { id: "c_" + Date.now(), label: "Novo item", done: false }] });
  const updCheck = (i: number, c: ChecklistItem) => {
    const arr = [...data.checklist]; arr[i] = c; setData({ ...data, checklist: arr });
  };
  const delCheck = (i: number) => setData({ ...data, checklist: data.checklist.filter((_, x) => x !== i) });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-5 overflow-y-auto">
      <div className="bg-neutral-950 border border-neutral-800 w-full max-w-2xl rounded-t-3xl sm:rounded-3xl max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-neutral-950 border-b border-neutral-800 px-5 py-4 flex items-center justify-between">
          <h3 className="font-bold">Editar missão</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Ordem</label>
            <input type="number" className="input" value={data.order} onChange={(e) => setData({ ...data, order: parseInt(e.target.value) || 0 })} />
          </div>
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Título</label>
            <input className="input" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Descrição</label>
            <textarea className="input min-h-[80px]" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={data.isExtra} onChange={(e) => setData({ ...data, isExtra: e.target.checked })} />
            Módulo Bônus (liberado individualmente para usuários)
          </label>

          {/* Conteúdos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-sm">Conteúdos</h4>
              <button onClick={addContent} className="text-xs px-2 py-1 rounded bg-neutral-800">+ Adicionar</button>
            </div>
            <div className="space-y-2">
              {data.contents.map((c, i) => (
                <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 space-y-2">
                  <div className="flex gap-2">
                    <select className="input !py-2 !text-xs" value={c.type} onChange={(e) => updContent(i, { ...c, type: e.target.value as ModuleContent["type"] })}>
                      <option value="text">Texto</option>
                      <option value="link">Link</option>
                      <option value="pdf">PDF</option>
                      <option value="image">Imagem</option>
                    </select>
                    <button onClick={() => delContent(i)} className="text-red-400 px-2"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <input className="input !py-2 !text-sm" placeholder="Rótulo" value={c.label} onChange={(e) => updContent(i, { ...c, label: e.target.value })} />
                  <textarea className="input !py-2 !text-sm" placeholder={c.type === "text" ? "Conteúdo de texto" : "URL"} value={c.value} onChange={(e) => updContent(i, { ...c, value: e.target.value })} />
                </div>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-sm">Checklist</h4>
              <button onClick={addCheck} className="text-xs px-2 py-1 rounded bg-neutral-800">+ Adicionar</button>
            </div>
            <div className="space-y-2">
              {data.checklist.map((c, i) => (
                <div key={c.id} className="flex gap-2">
                  <input className="input !py-2 !text-sm flex-1" value={c.label} onChange={(e) => updCheck(i, { ...c, label: e.target.value })} />
                  <button onClick={() => delCheck(i)} className="text-red-400 px-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-neutral-950 border-t border-neutral-800 p-4 flex gap-2">
          <button onClick={onClose} className="btn-ghost flex-1">Cancelar</button>
          <button onClick={() => onSave(data)} className="btn-gold flex-1 flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ModulosPage() {
  return <AdminGuard><ModulosContent /></AdminGuard>;
}
