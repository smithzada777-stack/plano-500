"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import AdminNav from "@/components/AdminNav";
import TopBar from "@/components/TopBar";
import { storage } from "@/lib/storage";
import { setUserStatus } from "@/lib/auth";
import { liberarAcesso } from "@/lib/pix";
import type { User } from "@/lib/types";
import { UserPlus, Ban, ShieldOff, ShieldCheck, KeyRound, X } from "lucide-react";

function UsuariosContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", whatsapp: "" });
  const [createdToken, setCreatedToken] = useState<string | null>(null);

  const reload = () => setUsers([...storage.listUsers()].sort((a, b) => b.createdAt - a.createdAt));
  useEffect(reload, []);

  const handleCreate = () => {
    if (!newUser.name || !newUser.email) return;
    const { token } = liberarAcesso(newUser);
    setCreatedToken(token);
    setNewUser({ name: "", email: "", whatsapp: "" });
    reload();
  };

  const handleStatus = (id: string, status: User["status"]) => {
    setUserStatus(id, status);
    reload();
  };

  const statusBadge = (s: User["status"]) => {
    const cfg = {
      ativo: "bg-green-500/15 text-green-400",
      bloqueado: "bg-amber-500/15 text-amber-400",
      banido: "bg-red-500/15 text-red-400",
    };
    return <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${cfg[s]}`}>{s}</span>;
  };

  return (
    <main className="min-h-screen flex flex-col">
      <TopBar variant="admin" userName="Admin" />
      <AdminNav />

      <section className="flex-1 px-5 py-6 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-black">Usuários</h1>
            <p className="text-sm text-neutral-400">{users.length} cadastrados</p>
          </div>
          <button
            onClick={() => { setShowCreate(true); setCreatedToken(null); }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-sm flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Criar
          </button>
        </div>

        {showCreate && (
          <div className="card mb-5 border-amber-500/40">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">Criar usuário manual</h3>
              <button onClick={() => setShowCreate(false)}><X className="w-5 h-5 text-neutral-400" /></button>
            </div>
            {createdToken ? (
              <div className="space-y-3">
                <p className="text-sm text-green-400">Usuário criado! Envie este token:</p>
                <div className="bg-black border border-neutral-800 rounded-xl p-3">
                  <p className="font-mono text-amber-400 break-all">{createdToken}</p>
                </div>
                <button onClick={() => { setCreatedToken(null); setShowCreate(false); }} className="btn-ghost">
                  Fechar
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <input className="input" placeholder="Nome" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                <input className="input" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                <input className="input" placeholder="WhatsApp (opcional)" value={newUser.whatsapp} onChange={(e) => setNewUser({ ...newUser, whatsapp: e.target.value })} />
                <button onClick={handleCreate} className="btn-gold">Criar e gerar token</button>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="card">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold truncate">{u.name}</p>
                    {statusBadge(u.status)}
                  </div>
                  <p className="text-xs text-neutral-400 truncate">{u.email}</p>
                  {u.whatsapp && <p className="text-xs text-neutral-500">{u.whatsapp}</p>}
                  {u.accessToken && (
                    <p className="text-[10px] font-mono text-amber-400 mt-1 flex items-center gap-1">
                      <KeyRound className="w-3 h-3" />
                      {u.accessToken}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {u.status !== "ativo" && (
                  <button onClick={() => handleStatus(u.id, "ativo")} className="text-xs px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Reativar
                  </button>
                )}
                {u.status === "ativo" && (
                  <button onClick={() => handleStatus(u.id, "bloqueado")} className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-400 flex items-center gap-1">
                    <ShieldOff className="w-3.5 h-3.5" /> Bloquear
                  </button>
                )}
                {u.status !== "banido" && (
                  <button onClick={() => handleStatus(u.id, "banido")} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 flex items-center gap-1">
                    <Ban className="w-3.5 h-3.5" /> Banir
                  </button>
                )}
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <div className="card text-center py-10 text-neutral-400">
              Nenhum usuário ainda. Use o botão Criar.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function UsuariosPage() {
  return <AdminGuard><UsuariosContent /></AdminGuard>;
}
