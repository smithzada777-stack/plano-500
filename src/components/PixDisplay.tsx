"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface Props {
  pixCode: string;
  qrCodeBase64?: string;
}

export default function PixDisplay({ pixCode, qrCodeBase64 }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = pixCode;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-4">
      {qrCodeBase64 && (
        <div className="bg-white p-4 rounded-2xl mx-auto w-fit">
          <img
            src={`data:image/png;base64,${qrCodeBase64}`}
            alt="QR Code PIX"
            className="w-48 h-48 object-contain"
          />
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3">
        <p className="text-[10px] uppercase text-neutral-500 mb-1">Código PIX (copia e cola)</p>
        <p className="text-xs break-all text-neutral-300 font-mono">{pixCode}</p>
      </div>

      <button
        onClick={handleCopy}
        className="btn-gold flex items-center justify-center gap-2"
      >
        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
        {copied ? "Código copiado!" : "Copiar código PIX"}
      </button>

      <p className="text-sm text-neutral-400 text-center">
        Copie o código, pague no app do seu banco e aguarde a confirmação.
      </p>
    </div>
  );
}
