"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function DiagnosticoBunnyPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [diagnosticData, setDiagnosticData] = useState<any>(null)

  const fetchDiagnostic = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/diagnose-bunny")

      if (!response.ok) {
        throw new Error(`Erro ao obter diagnóstico: ${response.status}`)
      }

      const data = await response.json()
      setDiagnosticData(data)
    } catch (err) {
      console.error("Erro ao executar diagnóstico:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido ao executar diagnóstico")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDiagnostic()
  }, [])

  const renderStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Diagnóstico do Bunny CDN</h1>
        <Button onClick={fetchDiagnostic} disabled={loading} variant="outline" className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configuração do Bunny</CardTitle>
            <CardDescription>Status das variáveis de ambiente e configuração</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>API Key configurada</span>
                  {renderStatusIcon(diagnosticData?.apiKeyConfigured)}
                </div>
                <div className="flex items-center justify-between">
                  <span>Storage Zone configurada</span>
                  {renderStatusIcon(diagnosticData?.storageZoneConfigured)}
                </div>
                <div className="flex items-center justify-between">
                  <span>Pull Zone configurada</span>
                  {renderStatusIcon(diagnosticData?.pullZoneConfigured)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teste de Conexão</CardTitle>
            <CardDescription>Resultado do teste de conexão com o Bunny CDN</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {diagnosticData?.connectionTest?.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className={diagnosticData?.connectionTest?.success ? "text-green-700" : "text-red-700"}>
                    {diagnosticData?.connectionTest?.success ? "Conexão bem-sucedida" : "Falha na conexão"}
                  </span>
                </div>
                <Alert variant={diagnosticData?.connectionTest?.success ? "default" : "destructive"}>
                  <AlertDescription>{diagnosticData?.connectionTest?.message}</AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>

        {diagnosticData?.connectionTest?.success && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Arquivos na Storage Zone</CardTitle>
              <CardDescription>
                Listando os primeiros {diagnosticData?.files?.length || 0} de {diagnosticData?.totalFiles || 0} arquivos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : diagnosticData?.files?.length > 0 ? (
                <div className="border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tamanho
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {diagnosticData.files.map((file: any, index: number) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {file.ObjectName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {file.IsDirectory ? "Diretório" : "Arquivo"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {file.IsDirectory ? "-" : `${Math.round(file.Length / 1024)} KB`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>Nenhum arquivo encontrado na storage zone.</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="text-sm text-gray-500">
              Última atualização: {new Date(diagnosticData?.timestamp).toLocaleString()}
            </CardFooter>
          </Card>
        )}

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Solução de Problemas</CardTitle>
            <CardDescription>Dicas para resolver problemas comuns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">API Key Inválida</h3>
                <p className="text-sm text-gray-600">
                  Verifique se a API Key está correta no painel do Bunny.net. A API Key deve ter o formato de um UUID
                  (ex: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).
                </p>
              </div>
              <div>
                <h3 className="font-medium">Storage Zone Não Encontrada</h3>
                <p className="text-sm text-gray-600">
                  Confirme se o nome da Storage Zone está correto e se ela existe no painel do Bunny.net.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Permissões Insuficientes</h3>
                <p className="text-sm text-gray-600">
                  Verifique se a API Key tem permissões suficientes para acessar a Storage Zone.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Pull Zone Não Configurada</h3>
                <p className="text-sm text-gray-600">
                  Configure uma Pull Zone no painel do Bunny.net e adicione a URL como variável de ambiente
                  BUNNY_PULLZONE_URL.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
