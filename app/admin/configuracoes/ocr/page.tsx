"use client"

import type React from "react"

import { useState } from "react"
import { Save, Loader2, ArrowLeft, Info } from "lucide-react"
import Link from "next/link"

export default function OCRConfigPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [ocrEnabled, setOcrEnabled] = useState(true)
  const [ocrLanguage, setOcrLanguage] = useState("por")
  const [ocrQuality, setOcrQuality] = useState("medium")
  const [ocrMaxPages, setOcrMaxPages] = useState(20)

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
        <div className="mb-6">
          <Link href="/admin/configuracoes" className="flex items-center text-[#4b7bb5] hover:text-[#3d649e]">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para Configurações
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-[#4072b0] mb-6">Configurações de OCR</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-[#4072b0] mb-4">Configurações Gerais de OCR</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center">
                <input
                  id="ocr_enabled"
                  type="checkbox"
                  checked={ocrEnabled}
                  onChange={(e) => setOcrEnabled(e.target.checked)}
                  className="h-4 w-4 text-[#4b7bb5] focus:ring-[#4b7bb5] border-gray-300 rounded"
                />
                <label htmlFor="ocr_enabled" className="ml-2 block text-sm font-medium text-gray-700">
                  Habilitar OCR para PDFs digitalizados
                </label>
              </div>

              <div>
                <label htmlFor="ocr_language" className="block text-sm font-medium text-gray-700 mb-1">
                  Idioma Principal
                </label>
                <select
                  id="ocr_language"
                  value={ocrLanguage}
                  onChange={(e) => setOcrLanguage(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4b7bb5]"
                >
                  <option value="por">Português</option>
                  <option value="eng">Inglês</option>
                  <option value="spa">Espanhol</option>
                  <option value="fra">Francês</option>
                  <option value="deu">Alemão</option>
                </select>
              </div>

              <div>
                <label htmlFor="ocr_quality" className="block text-sm font-medium text-gray-700 mb-1">
                  Qualidade do OCR
                </label>
                <select
                  id="ocr_quality"
                  value={ocrQuality}
                  onChange={(e) => setOcrQuality(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4b7bb5]"
                >
                  <option value="low">Baixa (mais rápido)</option>
                  <option value="medium">Média (recomendado)</option>
                  <option value="high">Alta (mais lento)</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Qualidade mais alta produz resultados melhores, mas leva mais tempo para processar.
                </p>
              </div>

              <div>
                <label htmlFor="ocr_max_pages" className="block text-sm font-medium text-gray-700 mb-1">
                  Máximo de Páginas para OCR
                </label>
                <input
                  id="ocr_max_pages"
                  type="number"
                  value={ocrMaxPages}
                  onChange={(e) => setOcrMaxPages(Number(e.target.value))}
                  min={1}
                  max={100}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4b7bb5]"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Limitar o número de páginas para OCR para evitar processamento excessivo em documentos grandes.
                </p>
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
            <h2 className="text-xl font-bold text-[#4072b0] mb-4">Informações sobre OCR</h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-[#4b7bb5] mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-700">O que é OCR?</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    OCR (Reconhecimento Óptico de Caracteres) é uma tecnologia que converte imagens de texto em texto
                    editável. É útil para extrair texto de PDFs digitalizados, que são essencialmente imagens.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Info className="h-5 w-5 text-[#4b7bb5] mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-700">Quando o OCR é utilizado?</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    O sistema detecta automaticamente quando um PDF é digitalizado (contém principalmente imagens em vez
                    de texto) e aplica OCR apenas nesses casos. Isso economiza recursos e melhora o desempenho.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Info className="h-5 w-5 text-[#4b7bb5] mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-700">Limitações do OCR</h3>
                  <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                    <li>A precisão depende da qualidade da digitalização</li>
                    <li>Documentos com fontes incomuns podem ter resultados piores</li>
                    <li>Processamento de OCR é mais lento que extração de texto normal</li>
                    <li>Documentos com muitas imagens ou layouts complexos podem ter resultados inconsistentes</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start">
                <Info className="h-5 w-5 text-[#4b7bb5] mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-700">Melhores Práticas</h3>
                  <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                    <li>Use PDFs com texto nativo sempre que possível</li>
                    <li>Para documentos digitalizados, use alta resolução (300 DPI ou mais)</li>
                    <li>Digitalizações em preto e branco geralmente têm melhores resultados de OCR</li>
                    <li>Limite o número de páginas para OCR para melhor desempenho</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
