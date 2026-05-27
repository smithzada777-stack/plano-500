"use client";

import { storage } from "./storage";
import { SEED_MODULES } from "./seed";

// Garante que existem dados iniciais no localStorage.
// Chamado uma vez no client.
export function ensureBootstrap() {
  if (typeof window === "undefined") return;
  if (storage.listModules().length === 0) {
    storage.saveModules(SEED_MODULES);
  }
  // settings com defaults já existe via storage.getSettings()
  storage.getSettings();
}
