"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import AdminNav from "@/components/AdminNav";
import TopBar from "@/components/TopBar";
import { storage } from "@/lib/storage";
import { liberarAcesso } from "@/lib/pix";
import type { Sale, Payment } from "@/lib/types";
import { Plus, X, Receipt } from "lucide-react";

function VendasContent() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", amount: "30" });
  const [createdToken, setCreatedToken] = useState<string | null>(null);

  const reload = () => {
    setSales([...storage.listSales()].sort((a, b) => b.createdAt - a.createdAt));
    setPayments([...storage.listPayments()].sort((a, b) => b.createdAt - a.createdAt));
  };
  useEffect(reload, []);

  const handleAdd = () => {
    const amount = parseFloat(form.amount);
    if (!form.name || !form.email || !amount) return;

    const { token } = liberarAcesso({ name: form.name, email: form.email, whatsapp: form.whatsapp });
    const all = storage.listSales();
    all.push({ id: "s_" + Date.now(), amount, source: "manual", createdAt: Date.now() });
    storage.saveSales(all);

    setCreatedToken(token);
    setForm({ name: "", email: "", whatsapp: "", amount: "30" });
    reload();
  };

  const total = sales.reduce((a, b) => a + b.amount, 0);

  return (
    <main className="min-h-screen flex flex-col">
      <TopBar variant="admin" userName="Admin" />
      <AdminNav />

      <section className="flex-1 px-5 py-6 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-black">Vendas</h1>
            <p className="text-sm text-neutral-400">{sales.length} vendas • R$ {total.toFixed(2)} arrecadado</p>
          </div>
          <button
            onClick={() => { setShowAdd(true); setCreatedToken(null); }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Manual
          </button>
        </div>

        {showAdd && (
          <div className="card mb-5 border-amber-500/40">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">Registrar venda manual</h3>
              <button onClick={() => setShowAdd(false)}><X className="w-5 h-5 text-neutral-400" /></button>
            </div>
            {createdToken ? (
              <div className="space-y-3">
                <p className="text-sm text-green-400">Venda registrada e acesso liberado!</p>
                <div className="bg-black border border-neutral-800 rounded-xl p-3">
                  <p className="text-xs text-neutral-500 mb-1">Token gerado:</p>
                  <p className="font-mono text-amber-400 break-all">{createdToken}</p>
                </div>
                <button onClick={() => { setCreatedToken(null); setShowAdd(false); }} className="btn-ghost">Fechar</button>
              </div>
            ) : (
              <div className="space-y-3">
                <input className="input" placeholder="Nome do cliente" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input className="input" placeholder="WhatsApp (opcional)" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
                <input className="input" type="number" placeholder="Valor" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                <button onClick={handleAdd} className="btn-gold">Registrar e gerar token</button>
              </div>
            )}
          </div>
        )}

        <h3 className="text-xs uppercase font-bold text-neutral-500 mb-2">Pagamentos PIX</h3>
        <div className="space-y-2 mb-6">
          {payments.length === 0 && (
            <div className="card text-center text-neutral-500 text-sm py-6">Nenhum pagamento ainda.</div>
          )}
          {payments.map((p) => (
            <div key={p.id} className="card flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">{p.email}</p>
                <p className="text-xs text-neutral-400">{new Date(p.createdAt).toLocaleString("pt-BR")}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-green-500">R$ {p.amount.toFixed(2)}</p>
                <span className={`text-[10px] uppercase font-bold ${
                  p.status === "aprovado" ? "text-green-400" :
                  p.status === "pendente" ? "text-amber-400" : "text-red-400"
                }`}>{p.status}</span>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-xs uppercase font-bold text-neutral-500 mb-2">Histórico de vendas</h3>
        <div className="space-y-2">
          {sales.length === 0 && (
            <div className="card text-center text-neutral-500 text-sm py-6">
              <Receipt className="w-8 h-8 mx-auto mb-2 text-neutral-700" />
              Sem vendas ainda.
            </div>
          )}
          {sales.map((s) => (
            <div key={s.id} className="card flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">R$ {s.amount.toFixed(2)}</p>
                <p className="text-xs text-neutral-400">{new Date(s.createdAt).toLocaleString("pt-BR")}</p>
              </div>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                s.source === "auto" ? "bg-green-500/15 text-green-400" : "bg-amber-500/15 text-amber-400"
              }`}>{s.source}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function VendasPage() {
  return <AdminGuard><VendasContent /></AdminGuard>;
}
