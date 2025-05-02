"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"

export function EmbeddingsConfig() {
  const [activeTab, setActiveTab] = useState("anthropic")
  const [testResults, setTestResults] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    openai: false,
    anthropic: false,
    supabase: false,
  })
  const [envVars, setEnvVars] = useState<Record<string, boolean>>({
    OPENAI_API_KEY: false,
    ANTHROPIC_API_KEY: false,
    SUPABASE_SERVICE_ROLE_KEY: false,
  })

  useEffect(() => {
    // Verificar variáveis de ambiente disponíveis
    async function checkEnvVars() {
      try {
        const response = await fetch("/api/check-env-vars")
        const data = await response.json()
        setEnvVars(data.envVars)
      } catch (error) {
        console.error("Erro ao verificar variáveis de ambiente:", error)
      }
    }

    checkEnvVars()
  }, [])

  const testEmbedding = async (provider: string) => {
    setIsLoading((prev) => ({ ...prev, [provider]: true }))
    setTestResults((prev) => ({ ...prev, [provider]: null }))

    try {
      const response = await fetch("/api/test-embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider,
          text: "Este é um texto de teste para verificar a geração de embeddings.",
        }),
      })

      const data = await response.json()
      setTestResults((prev) => ({ ...prev, [provider]: data }))
    } catch (error) {
      console.error(`Erro ao testar embeddings com ${provider}:`, error)
      setTestResults((prev) => ({
        ...prev,
        [provider]: { success: false, error: "Erro ao conectar com a API" },
      }))
    } finally {
      setIsLoading((prev) => ({ ...prev, [provider]: false }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração de Embeddings</CardTitle>
        <CardDescription>
          Configure e teste os diferentes provedores de embeddings disponíveis para o sistema de busca semântica.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="anthropic">Anthropic (Claude)</TabsTrigger>
            <TabsTrigger value="supabase">Supabase pgvector</TabsTrigger>
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
          </TabsList>

          <TabsContent value="openai">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium">Status:</h3>
                {envVars.OPENAI_API_KEY ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-1" />
                    <span>Configurado</span>
                  </div>
                ) : (
                  <div className="flex items-center text-amber-600">
                    <AlertTriangle className="h-5 w-5 mr-1" />
                    <span>Não configurado (OPENAI_API_KEY não encontrada)</span>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">
                  O provedor OpenAI utiliza o modelo text-embedding-ada-002 para gerar embeddings de alta qualidade com
                  1536 dimensões.
                </p>
                <Button onClick={() => testEmbedding("openai")} disabled={isLoading.openai || !envVars.OPENAI_API_KEY}>
                  {isLoading.openai ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Testando...
                    </>
                  ) : (
                    "Testar Conexão"
                  )}
                </Button>
              </div>

              {testResults.openai && (
                <div
                  className={`mt-4 p-4 rounded-md ${
                    testResults.openai.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}
                >
                  {testResults.openai.success ? (
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <div>
                        <p className="font-medium">Conexão bem-sucedida!</p>
                        <p className="text-sm">
                          Embedding gerado com {testResults.openai.dimensions} dimensões em {testResults.openai.timeMs}
                          ms
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <div>
                        <p className="font-medium">Erro na conexão</p>
                        <p className="text-sm">{testResults.openai.error}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="anthropic">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium">Status:</h3>
                {envVars.ANTHROPIC_API_KEY ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-1" />
                    <span>Configurado</span>
                  </div>
                ) : (
                  <div className="flex items-center text-amber-600">
                    <AlertTriangle className="h-5 w-5 mr-1" />
                    <span>Não configurado (ANTHROPIC_API_KEY não encontrada)</span>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">
                  O provedor Anthropic utiliza o modelo Claude para gerar embeddings. Atualmente, este é um método
                  experimental e pode não fornecer a mesma qualidade que o OpenAI.
                </p>
                <Button
                  onClick={() => testEmbedding("anthropic")}
                  disabled={isLoading.anthropic || !envVars.ANTHROPIC_API_KEY}
                >
                  {isLoading.anthropic ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Testando...
                    </>
                  ) : (
                    "Testar Conexão"
                  )}
                </Button>
              </div>

              {testResults.anthropic && (
                <div
                  className={`mt-4 p-4 rounded-md ${
                    testResults.anthropic.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}
                >
                  {testResults.anthropic.success ? (
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <div>
                        <p className="font-medium">Conexão bem-sucedida!</p>
                        <p className="text-sm">
                          Embedding gerado com {testResults.anthropic.dimensions} dimensões em{" "}
                          {testResults.anthropic.timeMs}ms
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <div>
                        <p className="font-medium">Erro na conexão</p>
                        <p className="text-sm">{testResults.anthropic.error}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="supabase">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium">Status:</h3>
                {envVars.SUPABASE_SERVICE_ROLE_KEY ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-1" />
                    <span>Configurado</span>
                  </div>
                ) : (
                  <div className="flex items-center text-amber-600">
                    <AlertTriangle className="h-5 w-5 mr-1" />
                    <span>Não configurado (SUPABASE_SERVICE_ROLE_KEY não encontrada)</span>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">
                  O provedor Supabase pgvector utiliza funções SQL personalizadas para gerar embeddings diretamente no
                  banco de dados. Requer configuração adicional no Supabase.
                </p>
                <Button
                  onClick={() => testEmbedding("supabase")}
                  disabled={isLoading.supabase || !envVars.SUPABASE_SERVICE_ROLE_KEY}
                >
                  {isLoading.supabase ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Testando...
                    </>
                  ) : (
                    "Testar Conexão"
                  )}
                </Button>
              </div>

              {testResults.supabase && (
                <div
                  className={`mt-4 p-4 rounded-md ${
                    testResults.supabase.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}
                >
                  {testResults.supabase.success ? (
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <div>
                        <p className="font-medium">Conexão bem-sucedida!</p>
                        <p className="text-sm">
                          Embedding gerado com {testResults.supabase.dimensions} dimensões em{" "}
                          {testResults.supabase.timeMs}ms
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <div>
                        <p className="font-medium">Erro na conexão</p>
                        <p className="text-sm">{testResults.supabase.error}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
