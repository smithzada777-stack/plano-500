// Camada de persistência mock (localStorage).
// Pronto para ser trocado pelo Firebase Firestore depois.
// Mantém a mesma assinatura: get/set/list/remove.

import type {
  User,
  Payment,
  Module,
  AccessToken,
  AdminSettings,
  Sale,
  AdSpend,
} from "./types";

const isBrowser = typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(value));
}

const KEYS = {
  users: "p500:users",
  payments: "p500:payments",
  modules: "p500:modules",
  tokens: "p500:tokens",
  settings: "p500:settings",
  sales: "p500:sales",
  ads: "p500:ads",
  session: "p500:session",
  adminSession: "p500:adminSession",
} as const;

export const storage = {
  // Users
  listUsers: () => read<User[]>(KEYS.users, []),
  saveUsers: (u: User[]) => write(KEYS.users, u),

  // Payments
  listPayments: () => read<Payment[]>(KEYS.payments, []),
  savePayments: (p: Payment[]) => write(KEYS.payments, p),

  // Modules
  listModules: () => read<Module[]>(KEYS.modules, []),
  saveModules: (m: Module[]) => write(KEYS.modules, m),

  // Tokens
  listTokens: () => read<AccessToken[]>(KEYS.tokens, []),
  saveTokens: (t: AccessToken[]) => write(KEYS.tokens, t),

  // Settings
  getSettings: () =>
    read<AdminSettings>(KEYS.settings, {
      weeklyGoal: 1000,
      productPrice: 30,
      productName: "Plano 500",
      adminPassword: "plano500",
    }),
  saveSettings: (s: AdminSettings) => write(KEYS.settings, s),

  // Sales
  listSales: () => read<Sale[]>(KEYS.sales, []),
  saveSales: (s: Sale[]) => write(KEYS.sales, s),

  // Ad spend
  listAds: () => read<AdSpend[]>(KEYS.ads, []),
  saveAds: (a: AdSpend[]) => write(KEYS.ads, a),

  // Sessão (token do membro logado)
  getSession: () => read<string | null>(KEYS.session, null),
  setSession: (token: string | null) => write(KEYS.session, token),

  // Sessão admin (boolean)
  getAdminSession: () => read<boolean>(KEYS.adminSession, false),
  setAdminSession: (v: boolean) => write(KEYS.adminSession, v),

  // Reset geral (debug)
  clearAll: () => {
    if (!isBrowser) return;
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
