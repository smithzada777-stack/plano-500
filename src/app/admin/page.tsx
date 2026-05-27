"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin, isAdmin } from "@/lib/auth";
import { ensureBootstrap } from "@/lib/bootstrap";
import { ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    ensureBootstrap();
    if (isAdmin()) router.replace("/admin/dashboard");
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(password)) {
      router.push("/admin/dashboard");
    } else {
      setError("Senha incorreta.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-black" />
          </div>
          <h1 className="text-2xl font-black">Painel Admin</h1>
          <p className="text-sm text-neutral-400 mt-1">Acesso restrito ao dono.</p>
        </div>

        <form onSubmit={handleLogin} className="card space-y-4">
          <div>
            <label className="block text-xs text-neutral-400 mb-1.5">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              autoFocus
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" className="btn-gold">
            Entrar
          </button>
          <p className="text-[11px] text-neutral-500 text-center">
            Senha padrão: <span className="font-mono">plano500</span> (alterar em Configurações)
          </p>
        </form>
      </div>
    </main>
  );
}
