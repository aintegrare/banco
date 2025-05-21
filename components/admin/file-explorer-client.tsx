"use client"

import { FileList } from "./file-list"
import { NotificationProvider, useNotification } from "./notification-manager"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, FolderPlus, Filter, Clock, Star, Share2, LayoutGrid, LayoutList } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdvancedSearch } from "./advanced-search"
import { FileExplorerHelp } from "./file-explorer-help"

// Componente interno que usa o hook useNotification
function FileExplorerContent() {
  const [selectedDirectory, setSelectedDirectory] = useState("documents")
  const notification = useNotification() // Agora está dentro do contexto do NotificationProvider
  const [showUploader, setShowUploader] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [quickViewFile, setQuickViewFile] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [fileTypes, setFileTypes] = useState<string[]>([])

  const handleSearch = (term: string, types: string[]) => {
    setSearchTerm(term)
    setFileTypes(types)
  }

  return (
    <div className="space-y-6">
      {/* Barra de ferramentas superior */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <AdvancedSearch onSearch={handleSearch} fileTypes={fileTypes} />

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowUploader(true)} className="flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              <span>Upload</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log("Criar pasta")}
              className="flex items-center"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              <span>Nova Pasta</span>
            </Button>

            <FileExplorerHelp />
          </div>
        </div>
      </div>

      {/* Abas e controles de visualização */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as any)}
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="all" className="flex items-center">
                <Filter className="h-4 w-4 mr-2 md:mr-0 md:hidden" />
                <span>Todos</span>
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center">
                <Clock className="h-4 w-4 mr-2 md:mr-0 md:hidden" />
                <span>Recentes</span>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center">
                <Star className="h-4 w-4 mr-2 md:mr-0 md:hidden" />
                <span>Favoritos</span>
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex items-center">
                <Share2 className="h-4 w-4 mr-2 md:mr-0 md:hidden" />
                <span>Compartilhados</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>

            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-8 w-8"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de arquivos */}
      <FileList initialDirectory={selectedDirectory} onFileClick={(file) => setQuickViewFile(file)} />
    </div>
  )
}

// Componente principal que fornece o contexto do NotificationProvider
export default function FileExplorerClient() {
  return (
    <NotificationProvider>
      <FileExplorerContent />
    </NotificationProvider>
  )
}
