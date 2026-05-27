import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

// Landing simples - principal CTA leva ao /checkout
export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <section className="flex-1 flex flex-col items-center justify-center px-5 py-12 max-w-md mx-auto w-full text-center">
        <span className="badge-gold mb-6">RENDA EXTRA REAL</span>

        <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
          Plano <span className="text-green-500">500</span>
        </h1>
        <p className="text-lg text-neutral-300 mb-8">
          O passo a passo direto para você gerar sua primeira renda extra em até 7 dias.
        </p>

        <div className="card w-full mb-6 text-left space-y-3">
          {[
            "Acesso vitalício à área de membros",
            "5 missões prontas para executar",
            "Materiais, links e checklists",
            "Atualizações sem custo extra",
          ].map((b) => (
            <div key={b} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <p className="text-sm text-neutral-200">{b}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-2">
          <p className="text-sm text-neutral-400 line-through">De R$ 197</p>
          <p className="text-4xl font-black text-amber-400">R$ 30</p>
          <p className="text-xs text-neutral-500 mt-1">Pagamento único via PIX</p>
        </div>

        <Link href="/checkout" className="btn-primary mt-6 flex items-center justify-center gap-2">
          Quero acessar agora
          <ArrowRight className="w-5 h-5" />
        </Link>

        <Link href="/login" className="mt-4 text-sm text-neutral-400 hover:text-white">
          Já comprei — entrar com meu acesso
        </Link>
      </section>

      <footer className="border-t border-neutral-900 py-4 text-center text-xs text-neutral-600">
        Plano 500 © {new Date().getFullYear()}
      </footer>
    </main>
  );
}
