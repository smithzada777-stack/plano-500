import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between bg-white/5 backdrop-blur-sm border-b border-white/10">
      <Link href="/" className="text-xl font-bold text-cyan-400">
        Plano 500
      </Link>
      <nav className="flex items-center gap-4">
        <Link href="/login" className="text-sm hover:text-cyan-400 transition">
          Entrar
        </Link>
        <Link
          href="/cadastro"
          className="text-sm px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition"
        >
          Criar Conta
        </Link>
      </nav>
    </header>
  );
}
