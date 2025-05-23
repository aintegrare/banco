"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [email] = useState("estrategia@designmarketing.com.br")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [envInfo, setEnvInfo] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)

  // Verificar variáveis de ambiente no carregamento
  useEffect(() => {
    const checkEnv = async () => {
      try {
        const response = await fetch("/api/check-env-vars")
        const data = await response.json()
        if (!data.supabaseConfigured) {
          setEnvInfo(
            "Configuração do Supabase não encontrada. O sistema funcionará em modo de demonstração com funcionalidades limitadas.",
          )
          setIsDemoMode(true)
          // Preencher a senha de demonstração automaticamente
          setPassword("Jivago14#")
        }
      } catch (error) {
        console.error("Erro ao verificar variáveis de ambiente:", error)
        setEnvInfo("Não foi possível verificar a configuração. O sistema tentará funcionar em modo de demonstração.")
        setIsDemoMode(true)
        // Preencher a senha de demonstração automaticamente
        setPassword("Jivago14#")
      }
    }

    checkEnv()
  }, [])

  // Efeito para redirecionar após login bem-sucedido
  useEffect(() => {
    if (loginSuccess) {
      console.log("Login bem-sucedido, redirecionando...")
      // Armazenar no localStorage como fallback
      localStorage.setItem("isAuthenticated", "true")
      if (isDemoMode) {
        localStorage.setItem("demoMode", "true")
      }
      // Redirecionar para a página admin
      window.location.href = "/admin"
    }
  }, [loginSuccess, isDemoMode])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("Enviando solicitação de login")

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      console.log("Resposta do login:", response.status)

      const data = await response.json()
      console.log("Dados da resposta:", data)

      if (!response.ok) {
        // Mensagem de erro mais detalhada
        if (response.status === 500 && data.error?.includes("Configuração do Supabase")) {
          throw new Error("Erro de configuração do servidor. Por favor, contate o administrador.")
        } else {
          throw new Error(data.error || "Falha ao fazer login")
        }
      }

      // Verificar se está em modo de demonstração
      if (data.demoMode) {
        setIsDemoMode(true)
        setMessage("Login em modo de demonstração. Algumas funcionalidades podem estar limitadas.")
      }

      // Marcar login como bem-sucedido para acionar o redirecionamento
      setLoginSuccess(true)
    } catch (err: any) {
      console.error("Erro no login:", err)
      setError(err.message || "Erro ao fazer login")
      setLoading(false)
    }
  }

  const handleCreateAdmin = async () => {
    setLoading(true)
    setError("")
    setMessage("")

    try {
      console.log("Enviando solicitação para criar usuário admin")

      const response = await fetch("/api/auth/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "estrategia@designmarketing.com.br",
          password: "Jivago14#",
        }),
      })

      console.log("Resposta recebida:", response.status)

      const data = await response.json()
      console.log("Dados da resposta:", data)

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar usuário administrador")
      }

      setPassword("Jivago14#")
      setMessage("Usuário administrador criado com sucesso! Senha: Jivago14#")
    } catch (err: any) {
      console.error("Erro capturado:", err)
      setError(err.message || "Erro ao criar usuário administrador")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-[#4b7bb5] mb-6">Integrare Admin</h1>

        {message && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <AlertDescription className="text-green-700">{message}</AlertDescription>
          </Alert>
        )}

        {envInfo && (
          <Alert className="mb-4 bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-700 mr-2" />
            <AlertDescription className="text-yellow-700 text-sm">{envInfo}</AlertDescription>
          </Alert>
        )}

        {isDemoMode && (
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-700 text-sm">
              <strong>Modo de Demonstração Ativo</strong>
              <br />
              Email: estrategia@designmarketing.com.br
              <br />
              Senha: Jivago14#
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          {error && (
            <Alert className="p-3 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-700 mr-2" />
              <AlertDescription className="text-red-700 text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4b7bb5] hover:bg-[#3d649e] disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {!isDemoMode && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Primeiro acesso?</span>
              </div>
            </div>

            <button
              onClick={handleCreateAdmin}
              disabled={loading}
              className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              {loading ? "Processando..." : "Criar Usuário Administrador"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
