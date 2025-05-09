"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function SetupInicialPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const router = useRouter()

  const setupAdminUser = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/setup/create-admin-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao configurar usuário administrador")
      }

      setResult({
        success: true,
        message: data.message || "Usuário administrador configurado com sucesso",
      })
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || "Erro ao configurar usuário administrador",
      })
    } finally {
      setLoading(false)
    }
  }

  const goToLogin = () => {
    router.push("/admin/login")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-[#4b7bb5]">Configuração Inicial</CardTitle>
          <CardDescription>Configure o usuário administrador para acessar o sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Esta página permite criar o usuário administrador inicial com as seguintes credenciais:
            </p>
            <div className="rounded-md bg-gray-100 p-3">
              <p>
                <strong>Email:</strong> estrategia@designmarketing.com.br
              </p>
              <p>
                <strong>Senha:</strong> Jivago14#
              </p>
            </div>
            <p className="text-sm text-gray-500">Após a criação, você poderá fazer login com estas credenciais.</p>

            {result && (
              <Alert variant={result.success ? "default" : "destructive"}>
                {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{result.success ? "Sucesso" : "Erro"}</AlertTitle>
                <AlertDescription>{result.message}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button onClick={setupAdminUser} disabled={loading} className="w-full bg-[#4b7bb5] hover:bg-[#3d649e]">
            {loading ? "Configurando..." : "Configurar Usuário Administrador"}
          </Button>

          {result?.success && (
            <Button onClick={goToLogin} variant="outline" className="w-full">
              Ir para o Login
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
