"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostsCanvas } from "./posts-canvas"
import { TimelineView } from "./timeline-view"
import { FlowChart } from "./flow-chart"
import { ChatInterface } from "./chat-interface"
import { WorkspacePanel } from "./workspace-panel"
import { AIModels } from "./aimodels"
import { ModulesTab } from "./modules-tab"
import { useMediaQuery } from "@/hooks/use-media-query"
import { MobileMenu } from "./mobile-menu"
import { Button } from "@/components/ui/button"
import { Menu, X, Save, Download, Upload } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export function SocialMediaPlatform() {
  const [activeTab, setActiveTab] = useState("posts")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [selectedCollections, setSelectedCollections] = useState<string[]>(["posts", "projects"])
  const [importFile, setImportFile] = useState<File | null>(null)
  const [overwriteExisting, setOverwriteExisting] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const isMobile = useMediaQuery("(max-width: 768px)")

  // Verificar se estamos no cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleExport = () => {
    if (typeof window !== "undefined") {
      // Simulação de exportação
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const fileName = `integrare-export-${timestamp}.json`

      const element = document.createElement("a")
      const file = new Blob([JSON.stringify({ collections: selectedCollections })], { type: "application/json" })
      element.href = URL.createObjectURL(file)
      element.download = fileName
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      setExportDialogOpen(false)
    }
  }

  const handleImport = () => {
    if (importFile && typeof window !== "undefined") {
      // Simulação de importação
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          console.log("Arquivo importado:", content)
          // Implementar lógica real de importação aqui
        } catch (error) {
          console.error("Erro ao importar arquivo:", error)
        }
      }
      reader.readAsText(importFile)
      setImportDialogOpen(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0])
    }
  }

  const handleCollectionChange = (collection: string, checked: boolean) => {
    if (checked) {
      setSelectedCollections([...selectedCollections, collection])
    } else {
      setSelectedCollections(selectedCollections.filter((c) => c !== collection))
    }
  }

  // Não renderizar nada durante a renderização no servidor
  if (!isClient) {
    return null
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center">
          {isMobile ? (
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-xl font-semibold ml-2 text-gray-800">Social Media Platform</h1>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => console.log("Salvando...")}>
            <Save className="h-4 w-4 mr-1" /> Salvar
          </Button>
          <Button size="sm" variant="outline" onClick={() => setExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-1" /> Exportar
          </Button>
          <Button size="sm" variant="outline" onClick={() => setImportDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-1" /> Importar
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobile && (
        <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
          <div className="p-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-semibold mb-4">Menu</h2>
            <div className="space-y-2">
              <Button
                variant={activeTab === "posts" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("posts")
                  setMobileMenuOpen(false)
                }}
              >
                Posts
              </Button>
              <Button
                variant={activeTab === "timeline" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("timeline")
                  setMobileMenuOpen(false)
                }}
              >
                Timeline
              </Button>
              <Button
                variant={activeTab === "mindmap" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("mindmap")
                  setMobileMenuOpen(false)
                }}
              >
                Mindmap
              </Button>
              <Button
                variant={activeTab === "chat" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("chat")
                  setMobileMenuOpen(false)
                }}
              >
                Chat
              </Button>
              <Button
                variant={activeTab === "ai" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("ai")
                  setMobileMenuOpen(false)
                }}
              >
                AI Models
              </Button>
              <Button
                variant={activeTab === "modules" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("modules")
                  setMobileMenuOpen(false)
                }}
              >
                Modules
              </Button>
            </div>
          </div>
        </MobileMenu>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {!isMobile && sidebarOpen && (
          <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <WorkspacePanel />
          </aside>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="border-b">
              <TabsList className="h-12">
                <TabsTrigger value="posts" className="px-4">
                  Posts
                </TabsTrigger>
                <TabsTrigger value="timeline" className="px-4">
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="mindmap" className="px-4">
                  Mindmap
                </TabsTrigger>
                <TabsTrigger value="chat" className="px-4">
                  Chat
                </TabsTrigger>
                <TabsTrigger value="ai" className="px-4">
                  AI Models
                </TabsTrigger>
                <TabsTrigger value="modules" className="px-4">
                  Modules
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="flex-1 overflow-auto">
              <TabsContent value="posts" className="h-full p-0 data-[state=active]:block">
                <PostsCanvas />
              </TabsContent>
              <TabsContent value="timeline" className="h-full p-0 data-[state=active]:block">
                <TimelineView />
              </TabsContent>
              <TabsContent value="mindmap" className="h-full p-0 data-[state=active]:block">
                <FlowChart />
              </TabsContent>
              <TabsContent value="chat" className="h-full p-0 data-[state=active]:block">
                <ChatInterface />
              </TabsContent>
              <TabsContent value="ai" className="h-full p-0 data-[state=active]:block">
                <AIModels />
              </TabsContent>
              <TabsContent value="modules" className="h-full p-0 data-[state=active]:block">
                <ModulesTab />
              </TabsContent>
            </div>
          </Tabs>
        </main>
      </div>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exportar Dados</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Selecione as coleções para exportar:</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="posts"
                    checked={selectedCollections.includes("posts")}
                    onCheckedChange={(checked) => handleCollectionChange("posts", checked === true)}
                  />
                  <Label htmlFor="posts">Posts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="projects"
                    checked={selectedCollections.includes("projects")}
                    onCheckedChange={(checked) => handleCollectionChange("projects", checked === true)}
                  />
                  <Label htmlFor="projects">Projetos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tasks"
                    checked={selectedCollections.includes("tasks")}
                    onCheckedChange={(checked) => handleCollectionChange("tasks", checked === true)}
                  />
                  <Label htmlFor="tasks">Tarefas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="clients"
                    checked={selectedCollections.includes("clients")}
                    onCheckedChange={(checked) => handleCollectionChange("clients", checked === true)}
                  />
                  <Label htmlFor="clients">Clientes</Label>
                </div>
              </div>
            </div>
            <Button onClick={handleExport} className="w-full">
              Exportar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Dados</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="importFile">Selecione o arquivo para importar:</Label>
              <Input id="importFile" type="file" onChange={handleFileChange} accept=".json,.zip" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="overwrite"
                checked={overwriteExisting}
                onCheckedChange={(checked) => setOverwriteExisting(checked === true)}
              />
              <Label htmlFor="overwrite">Substituir dados existentes</Label>
            </div>
            <Button onClick={handleImport} className="w-full" disabled={!importFile}>
              Importar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
