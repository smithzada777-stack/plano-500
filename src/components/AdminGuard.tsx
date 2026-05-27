"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { ensureBootstrap } from "@/lib/bootstrap";

// Wrapper que protege rotas /admin/*
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    ensureBootstrap();
    if (!isAdmin()) {
      router.replace("/admin");
      return;
    }
    setOk(true);
  }, [router]);

  if (!ok) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return <>{children}</>;
}
