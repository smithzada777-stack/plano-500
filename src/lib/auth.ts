"use client";

import { storage } from "./storage";
import type { User, AccessToken } from "./types";

function genToken() {
  return (
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 10)
  ).toUpperCase();
}

// Cria um usuário e devolve o token de acesso único
export function createUserWithAccess(data: {
  name: string;
  email: string;
  whatsapp?: string;
  paid?: boolean;
}): { user: User; token: string } {
  const users = storage.listUsers();
  const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
  const token = genToken();

  let user: User;
  if (existing) {
    existing.accessToken = token;
    if (data.paid) existing.paidAt = Date.now();
    user = existing;
  } else {
    user = {
      id: "u_" + Date.now(),
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp,
      status: "ativo",
      createdAt: Date.now(),
      paidAt: data.paid ? Date.now() : undefined,
      accessToken: token,
    };
    users.push(user);
  }
  storage.saveUsers(users);

  const tokens = storage.listTokens();
  tokens.push({
    token,
    userId: user.id,
    createdAt: Date.now(),
  });
  storage.saveTokens(tokens);

  return { user, token };
}

// Valida token e retorna o usuário (se válido e ativo)
export function validateToken(token: string): User | null {
  if (!token) return null;
  const tokens = storage.listTokens();
  const t = tokens.find((x) => x.token === token && !x.revokedAt);
  if (!t) return null;
  const user = storage.listUsers().find((u) => u.id === t.userId);
  if (!user) return null;
  if (user.status !== "ativo") return null;
  return user;
}

// Login via token: salva sessão local
export function loginWithToken(token: string): User | null {
  const user = validateToken(token);
  if (user) storage.setSession(token);
  return user;
}

export function getLoggedUser(): User | null {
  const token = storage.getSession();
  if (!token) return null;
  return validateToken(token);
}

export function logout() {
  storage.setSession(null);
}

// Revoga token (admin)
export function revokeToken(token: string) {
  const tokens = storage.listTokens();
  const t = tokens.find((x) => x.token === token);
  if (t) {
    t.revokedAt = Date.now();
    storage.saveTokens(tokens);
  }
}

// Bloquear / banir / reativar usuário
export function setUserStatus(userId: string, status: User["status"]) {
  const users = storage.listUsers();
  const u = users.find((x) => x.id === userId);
  if (!u) return;
  u.status = status;
  storage.saveUsers(users);
  // se bloqueado/banido, revoga todos os tokens dele
  if (status !== "ativo") {
    const tokens = storage.listTokens();
    tokens.forEach((t) => {
      if (t.userId === userId && !t.revokedAt) t.revokedAt = Date.now();
    });
    storage.saveTokens(tokens);
  }
}

// Admin
export function adminLogin(password: string): boolean {
  const settings = storage.getSettings();
  const ok = password === settings.adminPassword;
  storage.setAdminSession(ok);
  return ok;
}

export function isAdmin(): boolean {
  return storage.getAdminSession();
}

export function adminLogout() {
  storage.setAdminSession(false);
}
