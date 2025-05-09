"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const supabase = getSupabaseClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: "estrategia@designmarketing.com.br",
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push("/admin")
      }
    } catch (err) {
      setError("Erro ao fazer login")
    } finally {
      setLoading(false)
    }
  }

  const createAdmin = async () => {
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch("/api/create-admin")
      const data = await response.json()

      if (data.success) {
        setMessage("Usuário admin criado com sucesso! Senha: Jivago14#")
      } else {
        setError(data.error || "Erro ao criar usuário admin")
      }
    } catch (err) {
      setError("Erro ao criar usuário admin")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold text-center text-[#4b7bb5] mb-6">Login Admin</h1>

        {message && <p className="text-sm text-green-500 mb-4">{message}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <p className="text-sm mb-2">Email: estrategia@designmarketing.com.br</p>
            <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full bg-[#4b7bb5]" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Primeiro acesso? Crie o usuário admin:</p>
          <Button onClick={createAdmin} variant="outline" className="w-full" disabled={loading}>
            Criar Usuário Admin
          </Button>
        </div>
      </div>
    </div>
  )
}
