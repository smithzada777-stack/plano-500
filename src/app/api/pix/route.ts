import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, amount, description } = body;

    // ===== GATEWAY GENERICO =====
    // Aqui voce substitui pela API do seu gateway de PIX
    // Exemplo ficticio - substituir quando definir o gateway

    const mockPaymentId = `pix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Simula um QR Code base64 (em producao, vem da API do gateway)
    const mockQrCode = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const mockPixKey = "00020126580014BR.GOV.BCB.PIX0136mock@plano500.com520400005303986540530.005802BR5913Plano5006008SAOPAULO62130509Plano5006304";

    return NextResponse.json({
      success: true,
      paymentId: mockPaymentId,
      qrCodeBase64: mockQrCode,
      pixCopyPaste: mockPixKey,
      amount,
      email,
    });
  } catch (error) {
    console.error("[PIX API Error]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
