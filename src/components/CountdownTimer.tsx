"use client";

import { useEffect, useState } from "react";

// Countdown de urgência - reseta a cada 15min se chegar a 0
export default function CountdownTimer({ minutes = 15 }: { minutes?: number }) {
  const total = minutes * 60;
  const [seconds, setSeconds] = useState(total);

  useEffect(() => {
    const t = setInterval(() => {
      setSeconds((s) => (s <= 1 ? total : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [total]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="w-full bg-amber-500 text-black text-center py-2 px-4 text-sm font-bold flex items-center justify-center gap-2">
      <span>OFERTA EXPIRA EM</span>
      <span className="font-mono text-base">{mm}:{ss}</span>
    </div>
  );
}
