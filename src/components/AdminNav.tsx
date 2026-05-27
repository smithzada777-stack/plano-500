"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BookOpen, ShoppingCart, Settings } from "lucide-react";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
  { href: "/admin/modulos", label: "Módulos", icon: BookOpen },
  { href: "/admin/vendas", label: "Vendas", icon: ShoppingCart },
  { href: "/admin/config", label: "Config", icon: Settings },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="sticky bottom-0 sm:top-14 z-20 sm:relative bg-black/90 backdrop-blur-md border-t sm:border-t-0 sm:border-b border-neutral-800">
      <div className="max-w-5xl mx-auto px-2 sm:px-5 flex items-center justify-around sm:justify-start sm:gap-2 py-2 overflow-x-auto">
        {items.map((it) => {
          const active = pathname.startsWith(it.href);
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 py-2 rounded-xl text-xs font-medium transition shrink-0 ${
                active
                  ? "bg-amber-500/15 text-amber-400"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
