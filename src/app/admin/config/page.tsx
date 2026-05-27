"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import AdminNav from "@/components/AdminNav";
import TopBar from "@/components/TopBar";
import { storage } from "@/lib/storage";
import type { AdminSettings } from "@/lib/types";
import { Save, Trash2 } from "lucide-react";

function ConfigContent() {
  const [s, setS] = useState<AdminSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setS(storage.getSettings()); }, []);

  const save = () => {
    if (!s) return;
    storage.saveSettings(s);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetData = () => {
    if (!confirm("Apagar TODOS os dados (usuários, módulos, vendas)? Esta ação é irreversível.")) return;
    storage.clearAll();
    window.location.href = "/admin";
  };

  if (!s) return null;

  return (
    <main className="min-h-screen flex flex-col">
      <TopBar variant="admin" userName="Admin" />
      <AdminNav />

      <section className="flex-1 px-5 py-6 max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-black mb-1">Configurações</h1>
        <p className="text-sm text-neutral-400 mb-5">Ajuste o produto, senha e meta.</p>

        <div className="card space-y-4">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Nome do produto</label>
            <input className="input" value={s.productName} onChange={(e) => setS({ ...s, productName: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Preço (R$)</label>
            <input type="number" className="input" value={s.productPrice} onChange={(e) => setS({ ...s, productPrice: parseFloat(e.target.value) || 0 })} />
          </div>
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Meta semanal (R$)</label>
            <input type="number" className="input" value={s.weeklyGoal} onChange={(e) => setS({ ...s, weeklyGoal: parseFloat(e.target.value) || 0 })} />
          </div>
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Senha do admin</label>
            <input type="password" className="input" value={s.adminPassword} onChange={(e) => setS({ ...s, adminPassword: e.target.value })} />
          </div>

          <button onClick={save} className="btn-gold flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> {saved ? "Salvo!" : "Salvar"}
          </button>
        </div>

        <div className="card mt-5 border-red-900/50">
          <h3 className="font-bold text-red-400 mb-2">Zona de perigo</h3>
          <p className="text-xs text-neutral-400 mb-3">Apaga todos os dados locais (usado para testes).</p>
          <button onClick={resetData} className="text-sm px-4 py-2 rounded-lg bg-red-500/15 text-red-400 flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Resetar todos os dados
          </button>
        </div>
      </section>
    </main>
  );
}

export default function ConfigPage() {
  return <AdminGuard><ConfigContent /></AdminGuard>;
}
