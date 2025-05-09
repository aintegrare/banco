"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/layout/page-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

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

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="Configuração de Usuários" description="Gerencie os usuários administradores do sistema" />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Usuário Administrador</CardTitle>
          <CardDescription>Configure o usuário administrador padrão do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Esta ação irá criar o usuário administrador padrão com o email{" "}
            <strong>estrategia@designmarketing.com.br</strong> caso ele ainda não exista.
          </p>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"} className="mb-4">
              {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? "Sucesso" : "Erro"}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={setupAdminUser} disabled={loading} className="bg-[#4b7bb5] hover:bg-[#3d649e]">
            {loading ? "Configurando..." : "Configurar Usuário Administrador"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
