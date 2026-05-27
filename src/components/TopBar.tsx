"use client";

import Link from "next/link";
import { logout } from "@/lib/auth";
import { LogOut } from "lucide-react";

interface Props {
  userName?: string;
  variant?: "member" | "admin";
}

export default function TopBar({ userName, variant = "member" }: Props) {
  const handleLogout = () => {
    if (variant === "admin") {
      // admin logout via lib
      import("@/lib/auth").then((m) => m.adminLogout());
      window.location.href = "/admin";
    } else {
      logout();
      window.location.href = "/login";
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-black/80 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
        <Link href={variant === "admin" ? "/admin/dashboard" : "/acesso"} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-green-600 flex items-center justify-center font-black text-black text-sm">P5</div>
          <div className="leading-tight">
            <p className="text-sm font-bold">Plano 500</p>
            {userName && <p className="text-[10px] text-neutral-500">{userName}</p>}
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-neutral-900 transition"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </header>
  );
}
