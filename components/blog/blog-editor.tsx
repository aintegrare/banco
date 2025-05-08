"use client"

import { useState } from "react"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  ImageIcon,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface BlogEditorProps {
  value: string
  onChange: (value: string) => void
}

export function BlogEditor({ value, onChange }: BlogEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")

  // Função simulada para inserir formatação
  const insertFormat = (format: string) => {
    // Em uma implementação real, isso inseriria a formatação no texto
    console.log(`Inserindo formatação: ${format}`)
  }

  return (
    <div className="border rounded-md overflow-hidden">
      {/* Barra de ferramentas */}
      <div className="flex items-center bg-gray-50 border-b p-2 space-x-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("bold")} title="Negrito">
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertFormat("italic")}
          title="Itálico"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="h-4 w-px bg-gray-300 mx-1" />
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("h1")} title="Título 1">
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("h2")} title="Título 2">
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertFormat("h3")} title="Título 3">
          <Heading3 className="h-4 w-4" />
        </Button>
        <div className="h-4 w-px bg-gray-300 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertFormat("ul")}
          title="Lista não ordenada"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertFormat("ol")}
          title="Lista ordenada"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="h-4 w-px bg-gray-300 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertFormat("link")}
          title="Inserir link"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertFormat("image")}
          title="Inserir imagem"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <div className="h-4 w-px bg-gray-300 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertFormat("alignLeft")}
          title="Alinhar à esquerda"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertFormat("alignCenter")}
          title="Centralizar"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertFormat("alignRight")}
          title="Alinhar à direita"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
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
          className="w-full p-4 min-h-[400px] resize-y focus:outline-none"
          placeholder="Escreva o conteúdo do seu post aqui..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div className="p-4 min-h-[400px] prose max-w-none">
          {value ? (
            <div dangerouslySetInnerHTML={{ __html: value }} />
          ) : (
            <p className="text-gray-400">Nenhum conteúdo para visualizar</p>
          )}
        </div>
      )}
    </div>
  )
}
