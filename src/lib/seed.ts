// Dados iniciais (módulos fictícios) - editáveis pelo admin

import type { Module } from "./types";

export const SEED_MODULES: Module[] = [
  {
    id: "m1",
    order: 1,
    title: "Missão 1: Comece por aqui",
    description: "Visão geral do Plano 500 e como tirar resultado real nos próximos 7 dias.",
    contents: [
      { type: "text", label: "Boas-vindas", value: "Parabéns por dar o primeiro passo. Aqui você vai entender exatamente o que fazer." },
      { type: "link", label: "Vídeo de introdução", value: "https://youtube.com" },
    ],
    checklist: [
      { id: "c1", label: "Assistir o vídeo de introdução", done: false },
      { id: "c2", label: "Configurar seu ambiente de trabalho", done: false },
      { id: "c3", label: "Definir sua meta dos próximos 7 dias", done: false },
    ],
    visible: true,
    isExtra: false,
    createdAt: Date.now(),
  },
  {
    id: "m2",
    order: 2,
    title: "Missão 2: Sites de tarefas",
    description: "Plataformas validadas para começar a receber em até 24h.",
    contents: [
      { type: "text", label: "Lista de plataformas", value: "Cadastre-se nas 3 plataformas indicadas e siga o passo a passo." },
      { type: "pdf", label: "PDF com links e tutorial", value: "" },
    ],
    checklist: [
      { id: "c1", label: "Cadastrar nas 3 plataformas", done: false },
      { id: "c2", label: "Concluir 5 tarefas pagas", done: false },
    ],
    visible: true,
    isExtra: false,
    createdAt: Date.now(),
  },
  {
    id: "m3",
    order: 3,
    title: "Missão 3: Estratégia com conteúdo",
    description: "Como usar Instagram e WhatsApp para multiplicar seus ganhos.",
    contents: [
      { type: "text", label: "Roteiro pronto", value: "Use os 5 modelos de post e os 3 modelos de stories." },
      { type: "link", label: "Pasta de templates", value: "https://drive.google.com" },
    ],
    checklist: [
      { id: "c1", label: "Postar 3 conteúdos seguindo o modelo", done: false },
      { id: "c2", label: "Adicionar CTA no perfil", done: false },
    ],
    visible: true,
    isExtra: false,
    createdAt: Date.now(),
  },
  {
    id: "m4",
    order: 4,
    title: "Missão 4: Indicações",
    description: "Sistema de indicação que gera renda recorrente.",
    contents: [
      { type: "text", label: "Como funciona", value: "Cada indicação que se cadastrar te paga um percentual." },
    ],
    checklist: [
      { id: "c1", label: "Pegar seu link de indicação", done: false },
      { id: "c2", label: "Compartilhar com 10 contatos próximos", done: false },
    ],
    visible: true,
    isExtra: false,
    createdAt: Date.now(),
  },
  {
    id: "m5",
    order: 5,
    title: "Missão 5: Plano de ação",
    description: "Sua rotina prática para os próximos 30 dias.",
    contents: [
      { type: "text", label: "Cronograma", value: "Manhã: tarefas. Tarde: conteúdo. Noite: indicações." },
    ],
    checklist: [
      { id: "c1", label: "Imprimir/salvar o plano", done: false },
      { id: "c2", label: "Marcar 1h por dia na agenda", done: false },
    ],
    visible: true,
    isExtra: false,
    createdAt: Date.now(),
  },
];
