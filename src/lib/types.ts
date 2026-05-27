// Tipos centrais do Plano 500
// Espelham a estrutura prevista do Firebase

export interface User {
  id: string;
  name: string;
  email: string;
  whatsapp?: string;
  status: "ativo" | "bloqueado" | "banido";
  createdAt: number;
  paidAt?: number;
  accessToken?: string;
  extraModuleIds?: string[];
}

export interface Payment {
  id: string;
  userId?: string;
  email: string;
  amount: number;
  method: "pix";
  status: "pendente" | "aprovado" | "expirado";
  pixCode?: string;
  qrCodeBase64?: string;
  createdAt: number;
  paidAt?: number;
}

export interface ModuleContent {
  type: "text" | "link" | "pdf" | "image";
  label: string;
  value: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface Module {
  id: string;
  order: number;
  title: string;
  description: string;
  contents: ModuleContent[];
  checklist: ChecklistItem[];
  visible: boolean;
  isExtra: boolean;
  createdAt: number;
}

export interface AccessToken {
  token: string;
  userId: string;
  createdAt: number;
  revokedAt?: number;
}

export interface AdminSettings {
  weeklyGoal: number;
  productPrice: number;
  productName: string;
  adminPassword: string;
}

export interface Sale {
  id: string;
  paymentId?: string;
  amount: number;
  source: "auto" | "manual";
  createdAt: number;
}

export interface AdSpend {
  id: string;
  amount: number;
  description: string;
  createdAt: number;
}
