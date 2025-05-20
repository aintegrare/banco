"use client"

import { useState } from "react"
import { RefreshCw, Trash2, Clock, CheckCircle, AlertTriangle, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { checkCacheStatus, purgeBunnyCache } from "@/lib/bunny"

interface CacheConfigItem {
  type: string
  label: string
  maxAge: number
  staleWhileRevalidate: number
  mustRevalidate: boolean
}

export function BunnyCacheManager() {
  const [isLoading, setIsLoading] = useState(false)
  const [urlToCheck, setUrlToCheck] = useState("")
  const [cacheStatus, setCacheStatus] = useState<any>(null)
  const [urlToPurge, setUrlToPurge] = useState("")
  const [purgeStatus, setPurgeStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [purgeMessage, setPurgeMessage] = useState("")
  const [cacheConfigs, setCacheConfigs] = useState<CacheConfigItem[]>([
    {
      type: "image",
      label: "Imagens",
      maxAge: 30 * 24 * 60 * 60, // 30 dias
      staleWhileRevalidate: 24 * 60 * 60, // 1 dia
      mustRevalidate: false,
    },
    {
      type: "document",
      label: "Documentos",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      staleWhileRevalidate: 24 * 60 * 60, // 1 dia
      mustRevalidate: false,
    },
    {
      type: "design",
      label: "Arquivos de Design",
      maxAge: 24 * 60 * 60, // 1 dia
      staleWhileRevalidate: 0,
      mustRevalidate: true,
    },
    {
      type: "default",
      label: "Padrão",
      maxAge: 3 * 24 * 60 * 60, // 3 dias
      staleWhileRevalidate: 24 * 60 * 60, // 1 dia
      mustRevalidate: false,
    },
  ])
  const [selectedConfig, setSelectedConfig] = useState<string>("image")
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  // Função para verificar o status de cache de uma URL
  const handleCheckCache = async () => {
    if (!urlToCheck) return

    setIsLoading(true)
    setCacheStatus(null)

    try {
      const status = await checkCacheStatus(urlToCheck)
      setCacheStatus(status)
    } catch (error) {
      console.error("Erro ao verificar cache:", error)
      setCacheStatus({ error: "Erro ao verificar cache" })
    } finally {
      setIsLoading(false)
    }
  }

  // Função para purgar o cache de uma URL
  const handlePurgeCache = async () => {
    if (!urlToPurge) return

    setPurgeStatus("loading")
    setPurgeMessage("")

    try {
      // Extrair o caminho da URL
      let path = urlToPurge

      // Se for uma URL completa, extrair apenas o caminho
      if (urlToPurge.startsWith("http")) {
        try {
          const url = new URL(urlToPurge)
          path = url.pathname.replace(/^\//, "")
        } catch (e) {
          throw new Error("URL inválida")
        }
      }

      const success = await purgeBunnyCache(path)

      if (success) {
        setPurgeStatus("success")
        setPurgeMessage("Cache purgado com sucesso!")
      } else {
        setPurgeStatus("error")
        setPurgeMessage("Erro ao purgar cache")
      }
    } catch (error) {
      console.error("Erro ao purgar cache:", error)
      setPurgeStatus("error")
      setPurgeMessage(error instanceof Error ? error.message : "Erro desconhecido")
    }
  }

  // Função para formatar segundos em uma string legível
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds} segundos`
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutos`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} horas`
    return `${Math.floor(seconds / 86400)} dias`
  }

  // Função para atualizar uma configuração de cache
  const updateCacheConfig = (type: string, field: keyof CacheConfigItem, value: any) => {
    setCacheConfigs((prev) => prev.map((config) => (config.type === type ? { ...config, [field]: value } : config)))
  }

  // Função para salvar as configurações de cache
  const saveConfigurations = async () => {
    setIsSaving(true)
    setSaveMessage("")

    try {
      // Aqui você implementaria a lógica para salvar as configurações
      // Por exemplo, enviando para uma API que atualiza as configurações no servidor

      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSaveMessage("Configurações salvas com sucesso!")

      // Limpar a mensagem após alguns segundos
      setTimeout(() => {
        setSaveMessage("")
      }, 3000)
    } catch (error) {
      console.error("Erro ao salvar configurações:", error)
      setSaveMessage("Erro ao salvar configurações")
    } finally {
      setIsSaving(false)
    }
  }

  // Obter a configuração selecionada
  const currentConfig = cacheConfigs.find((config) => config.type === selectedConfig) || cacheConfigs[0]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#4072b0]">Gerenciador de Cache do Bunny CDN</CardTitle>
          <CardDescription>
            Gerencie as configurações de cache, verifique o status e purgue o cache quando necessário
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="check">
            <TabsList className="mb-4">
              <TabsTrigger value="check">Verificar Cache</TabsTrigger>
              <TabsTrigger value="purge">Purgar Cache</TabsTrigger>
              <TabsTrigger value="config">Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="check">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="url-to-check">URL para verificar</Label>
                    <Input
                      id="url-to-check"
                      placeholder="https://integrare.b-cdn.net/caminho/do/arquivo.jpg"
                      value={urlToCheck}
                      onChange={(e) => setUrlToCheck(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleCheckCache}
                      disabled={isLoading || !urlToCheck}
                      className="bg-[#4b7bb5] hover:bg-[#3d649e]"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verificando...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Verificar
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {cacheStatus && (
                  <div
                    className={`p-4 rounded-md ${
                      cacheStatus.error
                        ? "bg-red-50 border border-red-200"
                        : cacheStatus.cached
                          ? "bg-green-50 border border-green-200"
                          : "bg-yellow-50 border border-yellow-200"
                    }`}
                  >
                    <div className="flex items-start">
                      {cacheStatus.error ? (
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      ) : cacheStatus.cached ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                      )}

                      <div>
                        <h3 className="font-medium">
                          {cacheStatus.error
                            ? "Erro ao verificar cache"
                            : cacheStatus.cached
                              ? "Em cache"
                              : "Não está em cache"}
                        </h3>

                        {!cacheStatus.error && (
                          <div className="mt-2 space-y-1 text-sm">
                            {cacheStatus.age !== undefined && <p>Idade: {formatDuration(cacheStatus.age)}</p>}
                            {cacheStatus.expires && <p>Expira em: {new Date(cacheStatus.expires).toLocaleString()}</p>}
                            {cacheStatus.cacheControl && <p>Cache-Control: {cacheStatus.cacheControl}</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="purge">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="url-to-purge">URL ou caminho para purgar</Label>
                    <Input
                      id="url-to-purge"
                      placeholder="images/exemplo.jpg ou URL completa"
                      value={urlToPurge}
                      onChange={(e) => setUrlToPurge(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Você pode inserir o caminho relativo ou a URL completa</p>
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handlePurgeCache}
                      disabled={purgeStatus === "loading" || !urlToPurge}
                      variant="destructive"
                    >
                      {purgeStatus === "loading" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Purgando...
                        </>
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Purgar Cache
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {purgeStatus !== "idle" && purgeMessage && (
                  <div
                    className={`p-4 rounded-md ${
                      purgeStatus === "error"
                        ? "bg-red-50 border border-red-200"
                        : "bg-green-50 border border-green-200"
                    }`}
                  >
                    <div className="flex items-start">
                      {purgeStatus === "error" ? (
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      )}

                      <div>
                        <h3 className="font-medium">
                          {purgeStatus === "error" ? "Erro ao purgar cache" : "Cache purgado com sucesso"}
                        </h3>
                        <p className="mt-1 text-sm">{purgeMessage}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="config">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="config-type">Tipo de conteúdo</Label>
                  <Select value={selectedConfig} onValueChange={setSelectedConfig}>
                    <SelectTrigger id="config-type">
                      <SelectValue placeholder="Selecione o tipo de conteúdo" />
                    </SelectTrigger>
                    <SelectContent>
                      {cacheConfigs.map((config) => (
                        <SelectItem key={config.type} value={config.type}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Tempo máximo de cache (max-age)</Label>
                      <span className="text-sm text-gray-500">{formatDuration(currentConfig.maxAge)}</span>
                    </div>
                    <Slider
                      value={[currentConfig.maxAge]}
                      min={60}
                      max={365 * 24 * 60 * 60}
                      step={60}
                      onValueChange={(value) => updateCacheConfig(currentConfig.type, "maxAge", value[0])}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Tempo de revalidação (stale-while-revalidate)</Label>
                      <span className="text-sm text-gray-500">
                        {currentConfig.staleWhileRevalidate > 0
                          ? formatDuration(currentConfig.staleWhileRevalidate)
                          : "Desativado"}
                      </span>
                    </div>
                    <Slider
                      value={[currentConfig.staleWhileRevalidate]}
                      min={0}
                      max={7 * 24 * 60 * 60}
                      step={60}
                      disabled={currentConfig.mustRevalidate}
                      onValueChange={(value) => updateCacheConfig(currentConfig.type, "staleWhileRevalidate", value[0])}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="must-revalidate"
                      checked={currentConfig.mustRevalidate}
                      onCheckedChange={(checked) => {
                        updateCacheConfig(currentConfig.type, "mustRevalidate", checked)
                        if (checked) {
                          updateCacheConfig(currentConfig.type, "staleWhileRevalidate", 0)
                        }
                      }}
                    />
                    <Label htmlFor="must-revalidate">Forçar revalidação (must-revalidate)</Label>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                    <h4 className="font-medium text-sm mb-2">Cabeçalho Cache-Control resultante:</h4>
                    <code className="text-xs bg-white p-2 rounded border border-gray-200 block overflow-x-auto">
                      {`public, max-age=${currentConfig.maxAge}${
                        !currentConfig.mustRevalidate && currentConfig.staleWhileRevalidate > 0
                          ? `, stale-while-revalidate=${currentConfig.staleWhileRevalidate}`
                          : ""
                      }${currentConfig.mustRevalidate ? ", must-revalidate" : ""}`}
                    </code>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between">
          <div>
            {saveMessage && (
              <p className={`text-sm ${saveMessage.includes("sucesso") ? "text-green-600" : "text-red-600"}`}>
                {saveMessage}
              </p>
            )}
          </div>
          <Button onClick={saveConfigurations} disabled={isSaving} className="bg-[#4b7bb5] hover:bg-[#3d649e]">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
