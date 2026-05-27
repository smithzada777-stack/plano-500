"use client";

import { useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const [email, setEmail] = useState("");
  const [generated, setGenerated] = useState(false);

  const handleGeneratePix = () => {
    if (!email) return;
    // TODO: integrar com gateway PIX (backend)
    setGenerated(true);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-lg bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Plano 500</h2>
        <p className="text-gray-300 mb-6">Acesso vitalício ao conteúdo exclusivo.</p>
        <div className="text-5xl font-bold text-cyan-400 mb-8">R$ 30,00</div>

        {!generated ? (
          <>
            <div className="text-left mb-4">
              <label className="block text-sm mb-1">Email para receber o acesso</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 outline-none"
                placeholder="seu@email.com"
              />
            </div>
            <button
              onClick={handleGeneratePix}
              disabled={!email}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 font-bold text-lg hover:scale-[1.02] transition disabled:opacity-50"
            >
              Gerar PIX
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <p className="text-green-400 font-medium">Aguardando integração com gateway PIX</p>
            <div className="w-48 h-48 mx-auto bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-500 text-sm">
              QR Code aqui
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-xs break-all text-left border border-white/10 text-gray-400">
              Código PIX será exibido aqui após integração com o gateway.
            </div>
            <Link href="/login" className="text-cyan-400 hover:underline text-sm block">
              Já pagou? Faça login
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
