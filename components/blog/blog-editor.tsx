"use client"

import { useState, useRef, useEffect } from "react"
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
  Quote,
  Code,
  Undo,
  Redo,
  Underline,
  Type,
  PanelLeft,
  Eye,
  EyeOff,
  FileImage,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BlogEditorProps {
  value: string
  onChange: (value: string) => void
}

export function BlogEditor({ value, onChange }: BlogEditorProps) {
  const [activeTab, setActiveTab] = useState<string>("write")
  const [showToolbar, setShowToolbar] = useState(true)
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [imageCaption, setImageCaption] = useState("")
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const [selectionStart, setSelectionStart] = useState(0)
  const [selectionEnd, setSelectionEnd] = useState(0)
  const [history, setHistory] = useState<string[]>([value])
  const [historyIndex, setHistoryIndex] = useState(0)

  // Salvar a seleção atual quando o textarea é focado
  const handleSelect = () => {
    if (editorRef.current) {
      setSelectionStart(editorRef.current.selectionStart)
      setSelectionEnd(editorRef.current.selectionEnd)
    }
  }

  // Adicionar ao histórico quando o conteúdo muda
  useEffect(() => {
    if (value !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(value)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
  }, [value])

  // Função para desfazer
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      onChange(history[newIndex])
    }
  }

  // Função para refazer
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      onChange(history[newIndex])
    }
  }

  // Função para inserir formatação
  const insertFormat = (format: string) => {
    if (!editorRef.current) return

    const textarea = editorRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    let formattedText = ""
    let cursorPosition = 0

    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`
        cursorPosition = end + 4
        break
      case "italic":
        formattedText = `*${selectedText}*`
        cursorPosition = end + 2
        break
      case "underline":
        formattedText = `<u>${selectedText}</u>`
        cursorPosition = end + 7
        break
      case "h1":
        formattedText = `# ${selectedText}`
        cursorPosition = end + 2
        break
      case "h2":
        formattedText = `## ${selectedText}`
        cursorPosition = end + 3
        break
      case "h3":
        formattedText = `### ${selectedText}`
        cursorPosition = end + 4
        break
      case "ul":
        formattedText = `\n- ${selectedText}`
        cursorPosition = end + 3
        break
      case "ol":
        formattedText = `\n1. ${selectedText}`
        cursorPosition = end + 4
        break
      case "quote":
        formattedText = `\n> ${selectedText}`
        cursorPosition = end + 3
        break
      case "code":
        formattedText = `\`${selectedText}\``
        cursorPosition = end + 2
        break
      case "codeblock":
        formattedText = `\n\`\`\`\n${selectedText}\n\`\`\`\n`
        cursorPosition = end + 8
        break
      case "alignLeft":
        formattedText = `<div style="text-align: left">${selectedText}</div>`
        cursorPosition = end + 30
        break
      case "alignCenter":
        formattedText = `<div style="text-align: center">${selectedText}</div>`
        cursorPosition = end + 32
        break
      case "alignRight":
        formattedText = `<div style="text-align: right">${selectedText}</div>`
        cursorPosition = end + 31
        break
      default:
        return
    }

    const newValue = value.substring(0, start) + formattedText + value.substring(end)
    onChange(newValue)

    // Restaurar o foco e a posição do cursor
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start === end ? start + formattedText.length : start,
        start === end ? start + formattedText.length : start + formattedText.length,
      )
    }, 0)
  }

  // Função para inserir link
  const insertLink = () => {
    if (!editorRef.current) return

    const textarea = editorRef.current
    const selectedText = value.substring(selectionStart, selectionEnd)
    const linkMarkdown = `[${linkText || selectedText || "link"}](${linkUrl})`

    const newValue = value.substring(0, selectionStart) + linkMarkdown + value.substring(selectionEnd)

    onChange(newValue)
    setIsLinkDialogOpen(false)
    setLinkUrl("")
    setLinkText("")

    // Restaurar o foco
    setTimeout(() => {
      textarea.focus()
    }, 0)
  }

  // Função para inserir imagem
  const insertImage = () => {
    if (!editorRef.current) return

    const textarea = editorRef.current
    let imageMarkdown = `![${imageAlt}](${imageUrl})`

    if (imageCaption) {
      imageMarkdown = `<figure>\n  ${imageMarkdown}\n  <figcaption>${imageCaption}</figcaption>\n</figure>`
    }

    const newValue = value.substring(0, selectionStart) + imageMarkdown + value.substring(selectionEnd)

    onChange(newValue)
    setIsImageDialogOpen(false)
    setImageUrl("")
    setImageAlt("")
    setImageCaption("")

    // Restaurar o foco
    setTimeout(() => {
      textarea.focus()
    }, 0)
  }

  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <Tabs defaultValue="write" onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between bg-gray-50 border-b px-2">
          <TabsList className="bg-transparent border-0">
            <TabsTrigger
              value="write"
              className={`px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:text-[#4b7bb5] data-[state=active]:border-b-2 data-[state=active]:border-[#4b7bb5] rounded-none`}
            >
              <Type className="h-4 w-4 mr-2" />
              Escrever
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className={`px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:text-[#4b7bb5] data-[state=active]:border-b-2 data-[state=active]:border-[#4b7bb5] rounded-none`}
            >
              <Eye className="h-4 w-4 mr-2" />
              Visualizar
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setShowToolbar(!showToolbar)}
                  >
                    {showToolbar ? <EyeOff className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {showToolbar ? "Esconder barra de ferramentas" : "Mostrar barra de ferramentas"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {showToolbar && (
          <div className="flex flex-wrap items-center bg-gray-50 border-b p-1 gap-1">
            <div className="flex items-center space-x-1 mr-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={handleUndo}
                      disabled={historyIndex <= 0}
                    >
                      <Undo className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Desfazer</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={handleRedo}
                      disabled={historyIndex >= history.length - 1}
                    >
                      <Redo className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refazer</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="h-6 w-px bg-gray-300 mx-1" />

            <div className="flex items-center space-x-1 mr-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("bold")}>
                      <Bold className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Negrito</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("italic")}>
                      <Italic className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Itálico</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("underline")}>
                      <Underline className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sublinhado</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="h-6 w-px bg-gray-300 mx-1" />

            <div className="flex items-center space-x-1 mr-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("h1")}>
                      <Heading1 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Título 1</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("h2")}>
                      <Heading2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Título 2</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("h3")}>
                      <Heading3 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Título 3</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="h-6 w-px bg-gray-300 mx-1" />

            <div className="flex items-center space-x-1 mr-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("ul")}>
                      <List className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Lista não ordenada</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("ol")}>
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Lista ordenada</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("quote")}>
                      <Quote className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Citação</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("code")}>
                      <Code className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Código</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="h-6 w-px bg-gray-300 mx-1" />

            <div className="flex items-center space-x-1 mr-2">
              <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      if (editorRef.current) {
                        const selectedText = value.substring(
                          editorRef.current.selectionStart,
                          editorRef.current.selectionEnd,
                        )
                        setLinkText(selectedText)
                      }
                    }}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Inserir Link</DialogTitle>
                    <DialogDescription>Adicione um link ao seu conteúdo</DialogDescription>
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
                    <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]" onClick={insertLink} disabled={!linkUrl}>
                      Inserir Link
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Inserir Imagem</DialogTitle>
                    <DialogDescription>Adicione uma imagem ao seu conteúdo</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="imageUrl" className="text-right">
                        URL
                      </Label>
                      <div className="col-span-3 flex gap-2">
                        <Input
                          id="imageUrl"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="flex-1"
                          placeholder="https://exemplo.com/imagem.jpg"
                        />
                        <Button variant="outline" className="shrink-0">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    </div>
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
                      <Label htmlFor="imageCaption" className="text-right">
                        Legenda
                      </Label>
                      <Input
                        id="imageCaption"
                        value={imageCaption}
                        onChange={(e) => setImageCaption(e.target.value)}
                        className="col-span-3"
                        placeholder="Legenda opcional"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button className="bg-[#4b7bb5] hover:bg-[#3d649e]" onClick={insertImage} disabled={!imageUrl}>
                      Inserir Imagem
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="h-6 w-px bg-gray-300 mx-1" />

            <div className="flex items-center space-x-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("alignLeft")}>
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Alinhar à esquerda</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => insertFormat("alignCenter")}
                    >
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Centralizar</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => insertFormat("alignRight")}
                    >
                      <AlignRight className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Alinhar à direita</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}

        <TabsContent value="write" className="p-0 m-0">
          <textarea
            ref={editorRef}
            className="w-full p-4 min-h-[500px] resize-y focus:outline-none font-mono text-sm"
            placeholder="Escreva o conteúdo do seu post aqui usando Markdown ou HTML..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onSelect={handleSelect}
          />
        </TabsContent>

        <TabsContent value="preview" className="p-0 m-0">
          <div className="p-4 min-h-[500px] prose prose-blue max-w-none overflow-auto">
            {value ? (
              <div dangerouslySetInnerHTML={{ __html: value }} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                <FileImage className="h-16 w-16" />
                <p>Nenhum conteúdo para visualizar</p>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("write")}
                  className="text-[#4b7bb5] border-[#4b7bb5]"
                >
                  Começar a escrever
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-t text-xs text-gray-500">
        <div>{value.length} caracteres</div>
        <div>Markdown e HTML suportados</div>
      </div>
    </div>
  )
}
