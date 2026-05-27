import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ===== WEBHOOK GENERICO =====
    // Aqui voce adapta conforme o payload do seu gateway
    // Em producao, validar assinatura/autenticacao do webhook

    const { paymentId, status, email } = body;

    if (status === "approved" || status === "paid") {
      // Buscar usuario pelo email e ativar
      const usersRef = doc(db, "users", "placeholder_uid");
      // Em producao: query por email para achar o UID correto

      // Mock: Atualiza o campo active do usuario
      // await updateDoc(usersRef, { active: true, updatedAt: serverTimestamp() });

      console.log(`[WEBHOOK] Pagamento ${paymentId} aprovado para ${email}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[WEBHOOK Error]", error);
    return NextResponse.json({ received: true });
  }
}
