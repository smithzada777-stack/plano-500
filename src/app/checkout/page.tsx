"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Star, Shield, Zap, Loader2 } from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";
import PixDisplay from "@/components/PixDisplay";
import { gerarPix, verificarPagamento, confirmarPagamento } from "@/lib/pix";
import { ensureBootstrap } from "@/lib/bootstrap";
import type { Payment } from "@/lib/types";

const PRICE = 30;

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "pending" | "approved">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    ensureBootstrap();
  }, []);

  const handleGerarPix = async () => {
    if (!name || !email) return;
    setLoading(true);
    try {
      const p = await gerarPix({ name, email, whatsapp, amount: PRICE });
      setPayment(p);
      setStep("pending");
    } finally {
      setLoading(false);
    }
  };

  // MOCK: botão "simular pagamento". Em produção, polling real verificarPagamento()
  const handleSimularPagamento = async () => {
    if (!payment) return;
    setLoading(true);
    const result = await confirmarPagamento(payment.id, { name, whatsapp });
    if (result) {
      setAccessToken(result.token);
      setStep("approved");
    }
    setLoading(false);
  };

  const handleAcessar = () => {
    if (!accessToken) return;
    // login automático via token
    import("@/lib/auth").then(({ loginWithToken }) => {
      loginWithToken(accessToken);
      router.push("/acesso");
    });
  };

  return (
    <main className="min-h-screen flex flex-col">
      <CountdownTimer minutes={15} />

      <div className="flex-1 px-5 py-6 max-w-md mx-auto w-full">
        {step === "form" && (
          <>
            <div className="text-center mb-6">
              <span className="badge-gold mb-3">OFERTA LIMITADA</span>
              <h1 className="text-3xl font-black mt-3">Plano 500</h1>
              <p className="text-neutral-400 text-sm mt-2">
                Sua renda extra começa hoje. Pague R$ 30 e libere acesso vitalício.
              </p>
            </div>

            {/* Card de preço */}
            <div className="card mb-5 text-center">
              <p className="text-sm text-neutral-400 line-through">De R$ 197</p>
              <p className="text-5xl font-black text-green-500 mt-1">R$ 30</p>
              <p className="text-xs text-amber-400 mt-2 font-semibold">PAGAMENTO ÚNICO • PIX</p>
            </div>

            {/* Benefícios */}
            <div className="card mb-5">
              <h3 className="font-bold mb-3">O que você recebe:</h3>
              <div className="space-y-2.5">
                {[
                  "Acesso completo à área de membros",
                  "5 missões prontas e diretas",
                  "Lista de plataformas validadas",
                  "Templates prontos de Instagram e WhatsApp",
                  "Atualizações sem custo extra",
                  "Suporte via WhatsApp",
                ].map((b) => (
                  <div key={b} className="flex items-start gap-2.5">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-sm">{b}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Prova social */}
            <div className="card mb-5">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs text-neutral-400 ml-2">+ de 1.200 alunos</span>
              </div>
              <p className="text-sm text-neutral-300 italic">
                &quot;Em menos de uma semana já tinha tirado o investimento. O passo a passo é direto.&quot;
              </p>
              <p className="text-xs text-neutral-500 mt-2">— Mariana S., aluna</p>
            </div>

            {/* Selos */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="card !p-3 text-center">
                <Shield className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <p className="text-[10px] text-neutral-400">100% Seguro</p>
              </div>
              <div className="card !p-3 text-center">
                <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <p className="text-[10px] text-neutral-400">Acesso Imediato</p>
              </div>
              <div className="card !p-3 text-center">
                <Check className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <p className="text-[10px] text-neutral-400">Sem Mensalidade</p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-3 mb-5">
              <input
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
              />
              <input
                type="email"
                placeholder="Seu melhor email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
              <input
                type="tel"
                placeholder="WhatsApp (opcional)"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="input"
              />
            </div>

            <button
              onClick={handleGerarPix}
              disabled={loading || !name || !email}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando PIX...
                </span>
              ) : (
                "Gerar PIX e pagar R$ 30"
              )}
            </button>

            <p className="text-center text-[11px] text-neutral-500 mt-3">
              Compra 100% segura. Acesso imediato após confirmação do pagamento.
            </p>
          </>
        )}

        {step === "pending" && payment && (
          <div className="text-center">
            <span className="badge-gold mb-4">PAGAMENTO PENDENTE</span>
            <h1 className="text-2xl font-black mb-2 mt-3">Pague R$ 30 via PIX</h1>
            <p className="text-sm text-neutral-400 mb-6">
              Assim que você pagar, seu acesso é liberado automaticamente.
            </p>

            <div className="card mb-5">
              <PixDisplay pixCode={payment.pixCode || ""} qrCodeBase64={payment.qrCodeBase64} />
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-4">
              <p className="text-xs text-amber-300">
                Aguardando confirmação automática do pagamento...
              </p>
              <div className="mt-2 flex items-center justify-center gap-2 text-amber-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-mono">verificando</span>
              </div>
            </div>

            {/* Botão dev/mock - simula confirmação */}
            <button
              onClick={handleSimularPagamento}
              disabled={loading}
              className="btn-ghost text-xs"
            >
              {loading ? "Confirmando..." : "[Dev] Simular pagamento aprovado"}
            </button>
          </div>
        )}

        {step === "approved" && (
          <div className="text-center py-10">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-5">
              <Check className="w-10 h-10 text-green-500" strokeWidth={3} />
            </div>
            <h1 className="text-3xl font-black mb-2">Pagamento aprovado!</h1>
            <p className="text-neutral-400 mb-2">
              Seu acesso ao Plano 500 foi liberado.
            </p>
            {accessToken && (
              <div className="card my-5 text-left">
                <p className="text-xs text-neutral-500 mb-1">Seu token de acesso (guarde):</p>
                <p className="font-mono text-sm text-amber-400 break-all">{accessToken}</p>
              </div>
            )}
            <button onClick={handleAcessar} className="btn-primary">
              Acessar minhas missões
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
