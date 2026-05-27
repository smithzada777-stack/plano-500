"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [pixKey, setPixKey] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const handleGeneratePix = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, amount: 30, description: "Plano 500 - Acesso Exclusivo" }),
      });
      const data = await res.json();
      if (data.success) {
        setQrCode(data.qrCodeBase64);
        setPixKey(data.pixCopyPaste);
        setPaymentId(data.paymentId);
      }
    } catch (err) {
      alert("Erro ao gerar PIX. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-lg bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Plano 500</h2>
        <p className="text-gray-300 mb-6">Acesso vitalício ao conteúdo exclusivo.</p>
        <div className="text-5xl font-bold text-cyan-400 mb-8">R$ 30,00</div>

        {!qrCode ? (
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
              disabled={loading || !email}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 font-bold text-lg hover:scale-[1.02] transition disabled:opacity-50"
            >
              {loading ? "Gerando PIX..." : "Gerar PIX"}
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <p className="text-green-400 font-medium">Escaneie o QR Code ou copie o código PIX</p>
            {qrCode && (
              <img
                src={`data:image/png;base64,${qrCode}`}
                alt="QR Code PIX"
                className="mx-auto rounded-xl border border-white/10"
              />
            )}
            {pixKey && (
              <div className="bg-white/5 rounded-xl p-3 text-xs break-all text-left border border-white/10">
                <p className="text-gray-400 mb-1 text-[10px] uppercase">Código PIX</p>
                {pixKey}
              </div>
            )}
            <p className="text-sm text-gray-400">
              Assim que o pagamento for confirmado, seu acesso será liberado automaticamente.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="text-cyan-400 hover:underline text-sm"
            >
              Já pagou? Clique aqui para fazer login
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
