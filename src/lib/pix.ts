"use client";

import { storage } from "./storage";
import type { Payment } from "./types";
import { createUserWithAccess } from "./auth";

// =====================================================
// Camada PIX - estrutura pronta para conectar API real
// Por enquanto, simula geração e confirmação manual
// =====================================================

// QR Code placeholder (1px transparente). Em produção, vem do gateway.
const PLACEHOLDER_QR =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

// Gera uma cobrança PIX
export async function gerarPix(data: {
  email: string;
  name: string;
  whatsapp?: string;
  amount: number;
}): Promise<Payment> {
  const payment: Payment = {
    id: "pix_" + Date.now(),
    email: data.email,
    amount: data.amount,
    method: "pix",
    status: "pendente",
    pixCode:
      "00020126580014BR.GOV.BCB.PIX0136" +
      data.email.toLowerCase() +
      "5204000053039865406" +
      data.amount.toFixed(2) +
      "5802BR5913Plano5006008Brasil6304MOCK",
    qrCodeBase64: PLACEHOLDER_QR,
    createdAt: Date.now(),
  };

  const all = storage.listPayments();
  all.push(payment);
  storage.savePayments(all);

  return payment;
}

// Verifica status do pagamento (polling)
// Em produção: consulta API do gateway
export async function verificarPagamento(paymentId: string): Promise<Payment | null> {
  const all = storage.listPayments();
  return all.find((p) => p.id === paymentId) || null;
}

// Marca pagamento como aprovado e libera acesso (gera token)
export async function confirmarPagamento(
  paymentId: string,
  userData: { name: string; whatsapp?: string }
): Promise<{ payment: Payment; token: string } | null> {
  const all = storage.listPayments();
  const p = all.find((x) => x.id === paymentId);
  if (!p) return null;

  p.status = "aprovado";
  p.paidAt = Date.now();
  storage.savePayments(all);

  // Cria usuário e token de acesso
  const { user, token } = createUserWithAccess({
    name: userData.name,
    email: p.email,
    whatsapp: userData.whatsapp,
    paid: true,
  });
  p.userId = user.id;
  storage.savePayments(all);

  // Registra venda
  const sales = storage.listSales();
  sales.push({
    id: "s_" + Date.now(),
    paymentId: p.id,
    amount: p.amount,
    source: "auto",
    createdAt: Date.now(),
  });
  storage.saveSales(sales);

  return { payment: p, token };
}

// Libera acesso manual (admin)
export function liberarAcesso(data: {
  name: string;
  email: string;
  whatsapp?: string;
}): { token: string } {
  const { token } = createUserWithAccess({ ...data, paid: true });
  return { token };
}
