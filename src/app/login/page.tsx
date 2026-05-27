"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "@/lib/auth";
import Link from "next/link";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError("");
      const user = await loginUser(data.email, data.password);
      const token = await user.getIdToken();
      document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
      window.location.href = "/membros";
    } catch (err: any) {
      setError("Email ou senha inválidos.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Entrar na Conta</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Não tem conta?{" "}
          <Link href="/cadastro" className="text-cyan-400 hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
}
