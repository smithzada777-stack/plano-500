"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import AdminNav from "@/components/AdminNav";
import TopBar from "@/components/TopBar";
import { storage } from "@/lib/storage";
import { TrendingUp, DollarSign, Target, Megaphone } from "lucide-react";

function StatCard({ label, value, hint, color }: { label: string; value: string; hint?: string; color: string }) {
  return (
    <div className="card">
      <p className="text-xs text-neutral-400">{label}</p>
      <p className={`text-2xl font-black mt-1 ${color}`}>{value}</p>
      {hint && <p className="text-[10px] text-neutral-500 mt-1">{hint}</p>}
    </div>
  );
}

function DashboardContent() {
  const [data, setData] = useState({
    today: 0,
    week: 0,
    total: 0,
    adSpend: 0,
    profit: 0,
    goal: 1000,
    salesCount: 0,
  });
  const [adInput, setAdInput] = useState("");

  const reload = () => {
    const sales = storage.listSales();
    const ads = storage.listAds();
    const settings = storage.getSettings();

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);

    const today = sales.filter((s) => s.createdAt >= todayStart.getTime()).reduce((a, b) => a + b.amount, 0);
    const week = sales.filter((s) => now - s.createdAt <= 7 * dayMs).reduce((a, b) => a + b.amount, 0);
    const total = sales.reduce((a, b) => a + b.amount, 0);
    const adSpend = ads.reduce((a, b) => a + b.amount, 0);

    setData({
      today,
      week,
      total,
      adSpend,
      profit: total - adSpend,
      goal: settings.weeklyGoal,
      salesCount: sales.length,
    });
  };

  useEffect(reload, []);

  const addAdSpend = () => {
    const amount = parseFloat(adInput);
    if (!amount || amount <= 0) return;
    const ads = storage.listAds();
    ads.push({ id: "ad_" + Date.now(), amount, description: "Anúncio", createdAt: Date.now() });
    storage.saveAds(ads);
    setAdInput("");
    reload();
  };

  const goalPct = data.goal > 0 ? Math.min(100, Math.round((data.week / data.goal) * 100)) : 0;

  return (
    <main className="min-h-screen flex flex-col">
      <TopBar variant="admin" userName="Admin" />
      <AdminNav />

      <section className="flex-1 px-5 py-6 max-w-5xl mx-auto w-full">
        <h1 className="text-2xl font-black mb-1">Dashboard</h1>
        <p className="text-sm text-neutral-400 mb-5">Resumo de vendas, gastos e progresso da meta.</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard label="Vendas hoje" value={`R$ ${data.today.toFixed(2)}`} color="text-green-500" />
          <StatCard label="Vendas semana" value={`R$ ${data.week.toFixed(2)}`} color="text-green-500" />
          <StatCard label="Total recebido" value={`R$ ${data.total.toFixed(2)}`} hint={`${data.salesCount} vendas`} color="text-amber-400" />
          <StatCard label="Lucro estimado" value={`R$ ${data.profit.toFixed(2)}`} hint={`Após R$ ${data.adSpend.toFixed(2)} em ads`} color="text-white" />
        </div>

        {/* Meta semanal */}
        <div className="card mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" />
              <span className="font-bold">Meta semanal</span>
            </div>
            <span className="text-sm font-mono">
              R$ {data.week.toFixed(2)} / R$ {data.goal.toFixed(2)}
            </span>
          </div>
          <div className="h-3 rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-amber-500 transition-all"
              style={{ width: `${goalPct}%` }}
            />
          </div>
          <p className="text-xs text-neutral-400 mt-2">{goalPct}% da meta atingida</p>
        </div>

        {/* Add ad spend */}
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <Megaphone className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold">Registrar gasto com anúncio</h3>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="R$ 0,00"
              value={adInput}
              onChange={(e) => setAdInput(e.target.value)}
              className="input flex-1"
            />
            <button onClick={addAdSpend} className="px-5 rounded-xl bg-amber-500 text-black font-bold">
              Adicionar
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <AdminGuard>
      <DashboardContent />
    </AdminGuard>
  );
}
