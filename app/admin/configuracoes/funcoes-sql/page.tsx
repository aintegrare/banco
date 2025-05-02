"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function SQLFunctionsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ status: "success" | "error"; message: string } | null>(null)
  const { toast } = useToast()

  const setupFunctions = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/setup/create-functions", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao configurar funções SQL")
      }

      setResult({
        status: "success",
        message: data.message || "Funções SQL configuradas com sucesso!",
      })

      toast({
        title: "Sucesso!",
        description: "Funções SQL configuradas com sucesso.",
        variant: "default",
      })
    } catch (error: any) {
      console.error("Erro:", error)
      setResult({
        status: "error",
        message: error.message || "Erro ao configurar funções SQL",
      })

      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao configurar funções SQL.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Funções SQL</h1>

      <Card>
        <CardHeader>
          <CardTitle>Configurar Funções SQL</CardTitle>
          <CardDescription>Configure as funções SQL necessárias para o funcionamento do sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Este processo irá criar ou atualizar funções SQL no banco de dados para suportar operações como:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-500">
            <li>Verificação de colunas de tabelas (get_table_columns)</li>
            <li>Outras funções podem ser adicionadas no futuro</li>
          </ul>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4">
          <Button onClick={setupFunctions} disabled={isLoading} className="bg-[#4b7bb5] hover:bg-[#3d649e]">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Configurando...
              </>
            ) : (
              "Configurar Funções SQL"
            )}
          </Button>

          {result && (
            <div
              className={`flex items-center mt-2 text-sm ${result.status === "success" ? "text-green-600" : "text-red-600"}`}
            >
              {result.status === "success" ? (
                <CheckCircle className="mr-2 h-4 w-4" />
              ) : (
                <AlertCircle className="mr-2 h-4 w-4" />
              )}
              {result.message}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
