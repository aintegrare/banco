"use client"

import type React from "react"

import { useState } from "react"
import { Save, Loader2 } from "lucide-react"
import Link from "next/link"

export default function ConfiguracoesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Adicionar estado para o teste de conexão
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<{
    success?: boolean
    message?: string
    details?: any
  } | null>(null)

  // Adicionar função para testar a conexão
  const testConnection = async () => {
    try {
      setTestingConnection(true)
      setConnectionStatus(null)

      const response = await fetch("/api/test-bunny-connection")
      const data = await response.json()

      setConnectionStatus({
        success: data.success,
        message: data.message,
        details: data,
      })
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: error instanceof Error ? error.message : "Erro ao testar conexão",
      })
    } finally {
      setTestingConnection(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess(false)

    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    setSuccess(true)

    // Limpar mensagem de sucesso após 3 segundos
    setTimeout(() => {
      setSuccess(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-[#f2f1ef]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#4072b0] mb-6">Configurações do Sistema</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-[#4072b0] mb-4">Configurações de Processamento</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="chunk_size" className="block text-sm font-medium text-gray-700 mb-1">
                  Tamanho do Chunk (caracteres)
                </label>
                <input
                  id="chunk_size"
                  type="number"
                  defaultValue={1000}
                  min={100}
                  max={5000}
                  step={100}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4b7bb5]"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Tamanho dos fragmentos de texto para processamento. Valores menores são mais precisos, mas podem
                  perder contexto.
                </p>
              </div>

              <div>
                <label htmlFor="max_tokens" className="block text-sm font-medium text-gray-700 mb-1">
                  Limite de Tokens da IA
                </label>
                <input
                  id="max_tokens"
                  type="number"
                  defaultValue={1000}
                  min={100}
                  max={4000}
                  step={100}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4b7bb5]"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Número máximo de tokens para a resposta da IA. Valores maiores permitem respostas mais detalhadas.
                </p>
              </div>

              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                  Modelo de IA
                </label>
                <select
                  id="model"
                  defaultValue="claude-3-sonnet-20240229"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4b7bb5]"
                >
                  <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                  <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
                  <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[#4b7bb5] text-white rounded-md hover:bg-[#3d649e] focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Salvar Configurações</span>
                  </>
                )}
              </button>

              {success && (
                <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md">Configurações salvas com sucesso!</div>
              )}
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-[#4072b0] mb-4">Configurações do Bunny.net</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Pull Zone</h3>
                <p className="text-xs text-gray-500 mb-2">
                  Para acessar os arquivos publicamente, é necessário configurar uma Pull Zone no painel do Bunny.net.
                </p>
                <Link
                  href="/admin/configuracoes/bunny"
                  className="inline-flex items-center px-4 py-2 bg-[#4b7bb5] text-white rounded-md hover:bg-[#3d649e] focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:ring-offset-2 text-sm"
                >
                  Ver instruções de configuração
                </Link>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Status da conexão</h3>
                {connectionStatus ? (
                  <div
                    className={`px-4 py-2 rounded-md ${connectionStatus.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} flex items-center`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full mr-2 ${connectionStatus.success ? "bg-green-500" : "bg-red-500"}`}
                    ></span>
                    {connectionStatus.message || (connectionStatus.success ? "Conectado" : "Falha na conexão")}
                  </div>
                ) : (
                  <div className="px-4 py-2 bg-yellow-100 rounded-md text-yellow-700 flex items-center">
                    <span className="h-2 w-2 bg-yellow-500 rounded-full mr-2"></span>
                    Verificação pendente
                  </div>
                )}

                <button
                  onClick={testConnection}
                  disabled={testingConnection}
                  className="mt-2 px-4 py-2 border border-[#4b7bb5] text-[#4b7bb5] rounded-md hover:bg-[#f0f4f9] focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:ring-offset-2 disabled:opacity-50 text-sm"
                >
                  {testingConnection ? (
                    <>
                      <Loader2 className="h-4 w-4 inline animate-spin mr-1" />
                      Testando...
                    </>
                  ) : (
                    "Testar conexão agora"
                  )}
                </button>

                {connectionStatus?.details && (
                  <details className="mt-2 text-xs">
                    <summary className="cursor-pointer text-[#4b7bb5]">Detalhes técnicos</summary>
                    <pre className="mt-1 p-2 bg-gray-100 rounded overflow-auto max-h-40">
                      {JSON.stringify(connectionStatus.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-[#4072b0] mb-4">Configurações de Armazenamento</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zona de Armazenamento</label>
                <div className="px-4 py-2 bg-gray-100 rounded-md text-gray-700">
                  {process.env.BUNNY_STORAGE_ZONE || "Não configurado"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Região</label>
                <div className="px-4 py-2 bg-gray-100 rounded-md text-gray-700">
                  {process.env.BUNNY_STORAGE_REGION || "de"} (Frankfurt, Alemanha)
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status da API</label>
                <div className="px-4 py-2 bg-green-100 rounded-md text-green-700 flex items-center">
                  <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                  Conectado
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Limites de Armazenamento</h3>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div className="bg-[#4b7bb5] h-2.5 rounded-full" style={{ width: "25%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>25% utilizado</span>
                    <span>250MB de 1GB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Adicionar um novo card para configurações de OCR na seção de configurações */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-[#4072b0] mb-4">Configurações de OCR</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Status do OCR</h3>
                <div className="px-4 py-2 bg-green-100 rounded-md text-green-700 flex items-center">
                  <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                  Ativo
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Idioma Principal</h3>
                <div className="px-4 py-2 bg-gray-100 rounded-md text-gray-700">Português</div>
              </div>

              <div>
                <Link
                  href="/admin/configuracoes/ocr"
                  className="inline-flex items-center px-4 py-2 bg-[#4b7bb5] text-white rounded-md hover:bg-[#3d649e] focus:outline-none focus:ring-2 focus:ring-[#4b7bb5] focus:ring-offset-2 text-sm"
                >
                  Configurar OCR
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
