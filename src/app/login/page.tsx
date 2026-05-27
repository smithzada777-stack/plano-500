"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginWithToken } from "@/lib/auth";
import { KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = loginWithToken(token.trim().toUpperCase());
    if (!user) {
      setError("Token inválido, expirado ou conta bloqueada.");
      return;
    }
    router.push("/acesso");
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-7 h-7 text-black" />
          </div>
          <h1 className="text-2xl font-black">Acessar Plano 500</h1>
          <p className="text-sm text-neutral-400 mt-1">Cole seu token de acesso recebido após a compra.</p>
        </div>

        <form onSubmit={handleLogin} className="card space-y-4">
          <div>
            <label className="block text-xs text-neutral-400 mb-1.5">Token de acesso</label>
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Ex: AB12CD34EF56GH78"
              className="input font-mono uppercase"
              autoFocus
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" className="btn-primary">
            Entrar
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-neutral-400">
          Ainda não comprou?{" "}
          <Link href="/checkout" className="text-amber-400 font-semibold">
            Adquirir acesso
          </Link>
        </p>
      </div>
    </main>
  );
}
