"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function CadastroPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    console.log("Cadastro:", data);
    window.location.href = "/checkout";
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Criar Conta</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nome</label>
            <input
              type="text"
              {...register("name")}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 outline-none"
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 outline-none"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Senha</label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 outline-none"
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 font-bold hover:scale-[1.02] transition disabled:opacity-50"
          >
            {isSubmitting ? "Criando..." : "Criar Conta"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Já tem conta?{" "}
          <Link href="/login" className="text-cyan-400 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
