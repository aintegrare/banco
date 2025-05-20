"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { Wifi, WifiOff, Zap, Maximize, Minimize, Menu, ChevronLeft, ChevronRight } from "lucide-react"
import { FlowChart } from "./flow-chart"
import { TimelineView } from "./timeline-view"
import { PostsCanvas } from "./posts-canvas"
import ChatInterface from "./chat-interface"
import ModulesTab from "./modules-tab"
import AIModels from "./aimodels"
import WorkspacePanel from "./workspace-panel"
import { checkSupabaseConnection } from "@/lib/smp-service"
import MobileMenu from "./mobile-menu"
import { useMediaQuery } from "@/hooks/use-media-query"
import { OfflineIndicator } from "@/components/offline-indicator"
import { ExportImportDialog } from "@/components/export-import-dialog"

export function SocialMediaPlatform() {
  const [activeTab, setActiveTab] = useState("posts")
  const [selectedModule, setSelectedModule] = useState("instagram")
  const [selectedModel, setSelectedModel] = useState("content-generator")
  const [isOnline, setIsOnline] = useState(true)
  const [messages, setMessages] = useState([])
  const [showIntegrationAlert, setShowIntegrationAlert] = useState(false)
  const [integrationMessage, setIntegrationMessage] = useState("")
  const [pendingChanges, setPendingChanges] = useState(0)

  // Estados para controle de layout
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false)
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false)
  const [fullscreenMode, setFullscreenMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Detectar tamanho de tela para responsividade
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)")

  // Verificar conexão com o Supabase
  useEffect(() => {
    const checkConnection = async () => {
      const online = await checkSupabaseConnection()
      setIsOnline(online)
    }

    checkConnection()
    const interval = setInterval(checkConnection, 30000) // Verificar a cada 30 segundos

    return () => clearInterval(interval)
  }, [])

  // Simular mudanças pendentes para demonstração
  useEffect(() => {
    if (!isOnline) {
      // Simular acúmulo de mudanças pendentes quando offline
      const timer = setInterval(() => {
        setPendingChanges((prev) => Math.min(prev + 1, 10))
      }, 30000) // A cada 30 segundos

      return () => clearInterval(timer)
    } else if (pendingChanges > 0) {
      // Simular sincronização quando volta a ficar online
      const timer = setTimeout(() => {
        toast({
          title: "Sincronização Concluída",
          description: `${pendingChanges} alterações foram sincronizadas com sucesso.`,
        })
        setPendingChanges(0)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isOnline, pendingChanges])

  // Ajustar layout para mobile automaticamente
  useEffect(() => {
    if (isMobile) {
      setLeftPanelCollapsed(true)
      setRightPanelCollapsed(true)
    } else if (isTablet) {
      setRightPanelCollapsed(true)
    }
  }, [isMobile, isTablet])

  // Funções de integração entre componentes
  const handleApplyModuleToPost = (moduleId: string) => {
    setIntegrationMessage(`Aplicando módulo "${moduleId}" ao post atual...`)
    setShowIntegrationAlert(true)
    setActiveTab("posts")

    toast({
      title: "Módulo aplicado ao post",
      description: `O módulo foi aplicado com sucesso ao post atual.`,
    })

    // Esconder o alerta após 3 segundos
    setTimeout(() => {
      setShowIntegrationAlert(false)
    }, 3000)
  }

  const handleApplyModuleToTimeline = (moduleId: string) => {
    setIntegrationMessage(`Aplicando módulo "${moduleId}" à timeline...`)
    setShowIntegrationAlert(true)
    setActiveTab("timeline")

    toast({
      title: "Módulo aplicado à timeline",
      description: `O módulo foi aplicado com sucesso à timeline.`,
    })

    setTimeout(() => {
      setShowIntegrationAlert(false)
    }, 3000)
  }

  const handleApplyModuleToMindmap = (moduleId: string) => {
    setIntegrationMessage(`Aplicando módulo "${moduleId}" ao mindmap...`)
    setShowIntegrationAlert(true)
    setActiveTab("mindmap")

    toast({
      title: "Módulo aplicado ao mindmap",
      description: `O módulo foi aplicado com sucesso ao mindmap.`,
    })

    setTimeout(() => {
      setShowIntegrationAlert(false)
    }, 3000)
  }

  const handleGenerateContent = (modelId: string) => {
    setIntegrationMessage(`Gerando conteúdo com o modelo "${modelId}"...`)
    setShowIntegrationAlert(true)
    setActiveTab("posts")

    toast({
      title: "Conteúdo gerado",
      description: `O conteúdo foi gerado com sucesso usando o modelo selecionado.`,
    })

    setTimeout(() => {
      setShowIntegrationAlert(false)
    }, 3000)
  }

  const handleAnalyzePost = (modelId: string) => {
    setIntegrationMessage(`Analisando post com o modelo "${modelId}"...`)
    setShowIntegrationAlert(true)
    setActiveTab("posts")

    toast({
      title: "Post analisado",
      description: `O post foi analisado com sucesso usando o modelo selecionado.`,
    })

    setTimeout(() => {
      setShowIntegrationAlert(false)
    }, 3000)
  }

  const handleChatPrompt = (modelId: string) => {
    setIntegrationMessage(`Iniciando chat com o modelo "${modelId}"...`)
    setShowIntegrationAlert(true)
    setActiveTab("chat")

    // Adicionar mensagem ao chat
    const newMessage = {
      id: Date.now().toString(),
      text: `Olá! Estou usando o modelo ${modelId} para ajudar com sua estratégia de mídia social. Como posso ajudar?`,
      role: "assistant",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])

    toast({
      title: "Chat iniciado",
      description: `O chat foi iniciado com o modelo selecionado.`,
    })

    setTimeout(() => {
      setShowIntegrationAlert(false)
    }, 3000)
  }

  // Função para alternar modo tela cheia
  const toggleFullscreen = () => {
    if (!fullscreenMode) {
      setLeftPanelCollapsed(true)
      setRightPanelCollapsed(true)
    } else {
      setLeftPanelCollapsed(false)
      setRightPanelCollapsed(false)
    }
    setFullscreenMode(!fullscreenMode)
  }

  // Função para sincronização manual
  const handleManualSync = async () => {
    if (isOnline && pendingChanges > 0) {
      toast({
        title: "Sincronizando",
        description: `Sincronizando ${pendingChanges} alterações pendentes...`,
      })

      // Simular sincronização
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Sincronização Concluída",
        description: `${pendingChanges} alterações foram sincronizadas com sucesso.`,
      })

      setPendingChanges(0)
      return true
    }
    return false
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {!isOnline && (
        <Alert variant="destructive" className="m-2">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>Modo Offline</AlertTitle>
          <AlertDescription>
            Você está trabalhando no modo offline. Suas alterações serão salvas localmente até que a conexão seja
            restabelecida.
          </AlertDescription>
        </Alert>
      )}

      {showIntegrationAlert && (
        <Alert className="m-2 bg-blue-50 border-blue-200">
          <Zap className="h-4 w-4 text-blue-500" />
          <AlertTitle>Integração em Andamento</AlertTitle>
          <AlertDescription>{integrationMessage}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-xl font-bold">Plataforma de Mídia Social</h1>
          <p className="text-sm text-gray-500 hidden md:block">Gerencie sua estratégia de mídia social</p>
        </div>
        <div className="flex items-center gap-2">
          {!isMobile && (
            <OfflineIndicator
              pendingChanges={pendingChanges}
              onManualSync={handleManualSync}
              variant="badge"
              showCount={true}
            />
          )}

          <div className="flex items-center gap-1">
            {!isMobile && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleFullscreen}
                  title={fullscreenMode ? "Sair do modo tela cheia" : "Modo tela cheia"}
                >
                  {fullscreenMode ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>

                <ExportImportDialog
                  collections={["social_media_posts", "projects", "analytics"]}
                  defaultFileName="smp_export"
                  trigger={
                    <Button variant="outline" size="sm" className="h-8">
                      Exportar/Importar
                    </Button>
                  }
                />
              </>
            )}

            {isMobile ? (
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setMobileMenuOpen(true)}>
                <Menu className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsOnline(!isOnline)} className="h-8">
                {isOnline ? <WifiOff className="h-4 w-4 mr-1" /> : <Wifi className="h-4 w-4 mr-1" />}
                {isOnline ? "Simular Offline" : "Simular Online"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex w-full h-full relative">
          {/* Painel Esquerdo */}
          {!leftPanelCollapsed && (
            <div className="w-[300px] h-full border-r relative">
              {/* Botão de minimizar na barra lateral esquerda */}
              <div className="absolute top-1/2 right-0 z-10 transform -translate-y-1/2 translate-x-1/2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-[#4b7bb5] hover:bg-[#3d649e] text-white shadow-md"
                  onClick={() => setLeftPanelCollapsed(true)}
                  title="Minimizar painel esquerdo"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>

              <Tabs defaultValue="modules" className="h-full flex flex-col">
                <div className="border-b px-4 py-2">
                  <TabsList className="w-full">
                    <TabsTrigger value="modules" className="flex-1">
                      Módulos
                    </TabsTrigger>
                    <TabsTrigger value="models" className="flex-1">
                      Modelos IA
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="modules" className="flex-1 overflow-hidden">
                  <ModulesTab
                    selectedModule={selectedModule}
                    setSelectedModule={setSelectedModule}
                    onApplyToPost={handleApplyModuleToPost}
                    onApplyToTimeline={handleApplyModuleToTimeline}
                    onApplyToMindmap={handleApplyModuleToMindmap}
                  />
                </TabsContent>

                <TabsContent value="models" className="flex-1 overflow-hidden">
                  <AIModels
                    selectedModel={selectedModel}
                    setSelectedModel={setSelectedModel}
                    onGenerateContent={handleGenerateContent}
                    onAnalyzePost={handleAnalyzePost}
                    onChatPrompt={handleChatPrompt}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Botão para expandir painel esquerdo quando minimizado */}
          {leftPanelCollapsed && (
            <div className="absolute left-0 top-1/2 z-10 transform -translate-y-1/2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-[#4b7bb5] hover:bg-[#3d649e] text-white shadow-md"
                onClick={() => setLeftPanelCollapsed(false)}
                title="Expandir painel esquerdo"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Conteúdo Central */}
          <div className="flex-1 h-full overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="border-b px-4 py-2">
                <TabsList className="w-full overflow-x-auto flex-nowrap">
                  <TabsTrigger value="posts">Posts</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="mindmap">Mindmap</TabsTrigger>
                  <TabsTrigger value="chat">Chat IA</TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-hidden">
                <TabsContent
                  value="posts"
                  className="h-full m-0 p-0 data-[state=active]:flex data-[state=active]:flex-col"
                >
                  <PostsCanvas />
                </TabsContent>

                <TabsContent
                  value="timeline"
                  className="h-full m-0 p-0 data-[state=active]:flex data-[state=active]:flex-col"
                >
                  <TimelineView />
                </TabsContent>

                <TabsContent
                  value="mindmap"
                  className="h-full m-0 p-0 data-[state=active]:flex data-[state=active]:flex-col"
                >
                  <FlowChart />
                </TabsContent>

                <TabsContent
                  value="chat"
                  className="h-full m-0 p-0 data-[state=active]:flex data-[state=active]:flex-col"
                >
                  <div className="flex-1 p-4">
                    <ChatInterface messages={messages} setMessages={setMessages} selectedModule="assistant" />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Painel Direito */}
          {!rightPanelCollapsed && (
            <div className="w-[300px] h-full border-l relative">
              {/* Botão de minimizar na barra lateral direita */}
              <div className="absolute top-1/2 left-0 z-10 transform -translate-y-1/2 -translate-x-1/2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-[#4b7bb5] hover:bg-[#3d649e] text-white shadow-md"
                  onClick={() => setRightPanelCollapsed(true)}
                  title="Minimizar painel direito"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <WorkspacePanel
                selectedModule={selectedModule}
                selectedModel={selectedModel}
                activeTab={activeTab}
                isOnline={isOnline}
                isCompact={isTablet}
              />
            </div>
          )}

          {/* Botão para expandir painel direito quando minimizado */}
          {rightPanelCollapsed && (
            <div className="absolute right-0 top-1/2 z-10 transform -translate-y-1/2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-[#4b7bb5] hover:bg-[#3d649e] text-white shadow-md"
                onClick={() => setRightPanelCollapsed(false)}
                title="Expandir painel direito"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Menu móvel */}
      <MobileMenu
        isAdmin={true}
        toggleAdminMode={() => {}}
        isDarkMode={false}
        toggleDarkMode={() => {}}
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
      />
    </div>
  )
}
