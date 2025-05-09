"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  ImageIcon,
  LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Quote,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BlogEditorProps {
  value: string
  onChange: (value: string) => void
  onImageUpload?: (file: File) => Promise<string>
}

export function BlogEditor({ value, onChange, onImageUpload }: BlogEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Função para obter a seleção atual no textarea
  const getSelection = () => {
    const textarea = textareaRef.current
    if (!textarea) return { start: 0, end: 0, text: "" }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = value.substring(start, end)

    return { start, end, text }
  }

  // Função para inserir texto na posição do cursor
  const insertText = (before: string, after = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const { start, end, text } = getSelection()
    const newText = value.substring(0, start) + before + text + after + value.substring(end)

    onChange(newText)

    // Reposicionar o cursor após a operação
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  // Função para inserir formatação
  const insertFormat = (format: string) => {
    switch (format) {
      case "bold":
        insertText("**", "**")
        break
      case "italic":
        insertText("*", "*")
        break
      case "h1":
        insertText("# ", "\n")
        break
      case "h2":
        insertText("## ", "\n")
        break
      case "h3":
        insertText("### ", "\n")
        break
      case "ul":
        insertText("- ", "\n")
        break
      case "ol":
        insertText("1. ", "\n")
        break
      case "code":
        insertText("```\n", "\n```")
        break
      case "quote":
        insertText("> ", "\n")
        break
      case "alignLeft":
        insertText('<div style="text-align: left;">', "</div>")
        break
      case "alignCenter":
        insertText('<div style="text-align: center;">', "</div>")
        break
      case "alignRight":
        insertText('<div style="text-align: right;">', "</div>")
        break
      default:
        break
    }
  }

  // Função para inserir link
  const insertLink = () => {
    if (linkUrl) {
      const linkMarkdown = `[${linkText || linkUrl}](${linkUrl})`
      insertText(linkMarkdown, "")
      setLinkDialogOpen(false)
      setLinkUrl("")
      setLinkText("")
    }
  }

  // Função para inserir imagem
  const insertImage = async () => {
    if (imageFile && onImageUpload) {
      setIsUploading(true)
      try {
        const uploadedUrl = await onImageUpload(imageFile)
        const imageMarkdown = `![${imageAlt || "Imagem"}](${uploadedUrl})`
        insertText(imageMarkdown, "")
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error)
        alert("Erro ao fazer upload da imagem. Por favor, tente novamente.")
      } finally {
        setIsUploading(false)
        setImageDialogOpen(false)
        setImageUrl("")
        setImageAlt("")
        setImageFile(null)
      }
    } else if (imageUrl) {
      const imageMarkdown = `![${imageAlt || "Imagem"}](${imageUrl})`
      insertText(imageMarkdown, "")
      setImageDialogOpen(false)
      setImageUrl("")
      setImageAlt("")
    }
  }

  // Função para abrir o seletor de arquivos
  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Função para lidar com a seleção de arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setImageFile(files[0])
      // Criar uma URL temporária para visualização
      const tempUrl = URL.createObjectURL(files[0])
      setImageUrl(tempUrl)
    }
  }

  // Renderizar o HTML a partir do Markdown para a visualização
  const renderPreview = () => {
    // Esta é uma implementação simplificada
    // Em um ambiente de produção, você usaria uma biblioteca como marked.js
    const html = value
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/# (.*?)\n/g, "<h1>$1</h1>")
      .replace(/## (.*?)\n/g, "<h2>$1</h2>")
      .replace(/### (.*?)\n/g, "<h3>$1</h3>")
      .replace(/- (.*?)\n/g, "<li>$1</li>")
      .replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/!\[(.*?)\]$$(.*?)$$/g, '<img src="$2" alt="$1" style="max-width: 100%;" />')
      .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
      .replace(/> (.*?)\n/g, "<blockquote>$1</blockquote>")
      .replace(/\n/g, "<br />")

    return html
  }

  return (
    <div className="border rounded-md overflow-hidden">
      {/* Barra de ferramentas */}
      <div className="flex flex-wrap items-center bg-gray-50 border-b p-2 gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("bold")}>
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Negrito (Ctrl+B)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("italic")}>
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Itálico (Ctrl+I)</TooltipContent>
          </Tooltip>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("h1")}>
                <Heading1 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Título 1</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("h2")}>
                <Heading2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Título 2</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("h3")}>
                <Heading3 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Título 3</TooltipContent>
          </Tooltip>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("ul")}>
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Lista não ordenada</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("ol")}>
                <ListOrdered className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Lista ordenada</TooltipContent>
          </Tooltip>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setLinkDialogOpen(true)}>
                <LinkIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Inserir link</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setImageDialogOpen(true)}>
                <ImageIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Inserir imagem</TooltipContent>
          </Tooltip>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("code")}>
                <Code className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bloco de código</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("quote")}>
                <Quote className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Citação</TooltipContent>
          </Tooltip>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("alignLeft")}>
                <AlignLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Alinhar à esquerda</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("alignCenter")}>
                <AlignCenter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Centralizar</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("alignRight")}>
                <AlignRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Alinhar à direita</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Abas */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "write" ? "text-[#4b7bb5] border-b-2 border-[#4b7bb5]" : "text-gray-500 hover:text-[#4b7bb5]"
          }`}
          onClick={() => setActiveTab("write")}
        >
          Escrever
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "preview"
              ? "text-[#4b7bb5] border-b-2 border-[#4b7bb5]"
              : "text-gray-500 hover:text-[#4b7bb5]"
          }`}
          onClick={() => setActiveTab("preview")}
        >
          Visualizar
        </button>
      </div>

      {/* Área de edição */}
      {activeTab === "write" ? (
        <textarea
          ref={textareaRef}
          className="w-full p-4 min-h-[400px] resize-y focus:outline-none font-mono text-sm"
          placeholder="Escreva o conteúdo do seu post aqui..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div className="p-4 min-h-[400px] prose max-w-none">
          {value ? (
            <div dangerouslySetInnerHTML={{ __html: renderPreview() }} />
          ) : (
            <p className="text-gray-400">Nenhum conteúdo para visualizar</p>
          )}
        </div>
      )}

      {/* Diálogo para inserir link */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Inserir Link</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="linkText" className="text-right">
                Texto
              </Label>
              <Input
                id="linkText"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="col-span-3"
                placeholder="Texto do link"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="linkUrl" className="text-right">
                URL
              </Label>
              <Input
                id="linkUrl"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="col-span-3"
                placeholder="https://exemplo.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={insertLink} className="bg-[#4b7bb5] hover:bg-[#3d649e]">
              Inserir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para inserir imagem */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Inserir Imagem</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {imageUrl && (
              <div className="flex justify-center mb-4">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="max-h-40 max-w-full object-contain"
                />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageAlt" className="text-right">
                Texto Alt
              </Label>
              <Input
                id="imageAlt"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className="col-span-3"
                placeholder="Descrição da imagem"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">
                URL
              </Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="col-span-3"
                placeholder="https://exemplo.com/imagem.jpg"
                disabled={!!imageFile}
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">ou</p>
              <Button
                type="button"
                variant="outline"
                onClick={openFilePicker}
                className="border-[#4b7bb5] text-[#4b7bb5]"
              >
                Selecionar Arquivo
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={insertImage}
              disabled={isUploading || (!imageUrl && !imageFile)}
              className="bg-[#4b7bb5] hover:bg-[#3d649e]"
            >
              {isUploading ? "Enviando..." : "Inserir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
