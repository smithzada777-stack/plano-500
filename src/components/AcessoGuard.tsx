"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLoggedUser } from "@/lib/auth";
import { ensureBootstrap } from "@/lib/bootstrap";
import type { User } from "@/lib/types";

// Wrapper que protege rotas de membros
export default function AcessoGuard({ children }: { children: (user: User) => React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    ensureBootstrap();
    const u = getLoggedUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);
    setChecked(true);
  }, [router]);

  if (!checked || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return <>{children(user)}</>;
}
