"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Loader2, RefreshCw, Shield, FileWarning, Settings } from "lucide-react"

export default function VerificarBunnyPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const checkConfig = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/check-bunny-config")

      if (!response.ok) {
        throw new Error(`Erro ao verificar configuração: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      console.error("Erro ao verificar configuração:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkConfig()
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verificar Configuração do Bunny CDN"
        description="Verifique se a configuração do Bunny CDN está otimizada para o melhor desempenho"
      />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-[#4072b0]">Status da Configuração</CardTitle>
              <CardDescription>Verificação automática das configurações do Bunny CDN</CardDescription>
            </div>
            <Button onClick={checkConfig} disabled={isLoading} variant="outline">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Verificar Novamente
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading && !result && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-[#4b7bb5] animate-spin mb-4" />
              <p className="text-gray-600">Verificando configuração do Bunny CDN...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Erro ao verificar configuração</h3>
                  <p className="mt-2 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <div
                className={`p-4 rounded-md ${
                  result.success ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"
                }`}
              >
                <div className="flex">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">
                      {result.success
                        ? "Configuração do Bunny CDN está otimizada"
                        : "Configuração do Bunny CDN precisa de atenção"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {result.success
                        ? "Todas as configurações estão corretas para um desempenho ótimo"
                        : `Encontramos ${result.issues.length} problema(s) que precisam ser resolvidos`}
                    </p>
                  </div>
                </div>
              </div>

              {result.issues.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    Problemas Encontrados
                  </h3>
                  <ul className="space-y-1 list-disc list-inside text-sm text-gray-600 pl-2">
                    {result.issues.map((issue: string, index: number) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.recommendations.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                    <Settings className="h-4 w-4 text-[#4b7bb5] mr-2" />
                    Recomendações
                  </h3>
                  <ul className="space-y-1 list-disc list-inside text-sm text-gray-600 pl-2">
                    {result.recommendations.map((rec: string, index: number) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-3">Detalhes da Configuração</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`p-3 rounded-md border ${
                      result.details.pullZoneExists ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start">
                      {result.details.pullZoneExists ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-800">Pull Zone</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {result.details.pullZoneExists
                            ? `Configurada (ID: ${result.details.pullZoneId})`
                            : "Não configurada"}
                        </p>
                        {result.details.pullZoneUrl && (
                          <p className="text-sm text-gray-600 mt-1">URL: {result.details.pullZoneUrl}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-md border ${
                      result.details.storageZoneExists ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start">
                      {result.details.storageZoneExists ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-800">Storage Zone</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {result.details.storageZoneExists
                            ? `Configurada (ID: ${result.details.storageZoneId})`
                            : "Não configurada"}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Nome: {process.env.BUNNY_STORAGE_ZONE || "Não definido"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {result.details.pullZoneExists && (
                    <>
                      <div
                        className={`p-3 rounded-md border ${
                          result.details.originShieldEnabled
                            ? "bg-green-50 border-green-200"
                            : "bg-yellow-50 border-yellow-200"
                        }`}
                      >
                        <div className="flex items-start">
                          {result.details.originShieldEnabled ? (
                            <Shield className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          ) : (
                            <Shield className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                          )}
                          <div>
                            <h4 className="font-medium text-gray-800">Origin Shield</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {result.details.originShieldEnabled ? "Ativado" : "Desativado"}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {result.details.originShieldEnabled
                                ? "Protege seu servidor de origem e melhora o desempenho"
                                : "Recomendamos ativar para melhor desempenho"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`p-3 rounded-md border ${
                          result.details.errorPageEnabled
                            ? "bg-green-50 border-green-200"
                            : "bg-yellow-50 border-yellow-200"
                        }`}
                      >
                        <div className="flex items-start">
                          {result.details.errorPageEnabled ? (
                            <FileWarning className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          ) : (
                            <FileWarning className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                          )}
                          <div>
                            <h4 className="font-medium text-gray-800">Página de Erro</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {result.details.errorPageEnabled ? "Configurada" : "Não configurada"}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {result.details.errorPageEnabled
                                ? "Melhora a experiência do usuário em caso de erros"
                                : "Recomendamos configurar para melhor experiência do usuário"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`p-3 rounded-md border ${
                          result.details.cacheSettingsOptimal
                            ? "bg-green-50 border-green-200"
                            : "bg-yellow-50 border-yellow-200"
                        }`}
                      >
                        <div className="flex items-start">
                          {result.details.cacheSettingsOptimal ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                          )}
                          <div>
                            <h4 className="font-medium text-gray-800">Configurações de Cache</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {result.details.cacheSettingsOptimal ? "Otimizadas" : "Não otimizadas"}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {result.details.cacheSettingsOptimal
                                ? "Configurações de cache estão otimizadas para melhor desempenho"
                                : "Recomendamos aumentar o tempo de cache para melhor desempenho"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <div className="text-sm text-gray-500">
            Última verificação: {result ? new Date().toLocaleString() : "Nunca"}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
