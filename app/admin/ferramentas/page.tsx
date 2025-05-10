import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { FileSearch, Link2, FolderSearch, FileWarning, FileCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Ferramentas Administrativas",
  description: "Ferramentas administrativas para gerenciamento do sistema",
}

const tools = [
  {
    title: "Diagnóstico de URL",
    description: "Verificar e diagnosticar problemas com URLs de documentos",
    href: "/admin/ferramentas/diagnostico-url",
    icon: <Link2 className="h-8 w-8 text-[#4b7bb5]" />,
  },
  {
    title: "Verificar Documento",
    description: "Verificar a integridade e processamento de documentos",
    href: "/admin/ferramentas/verificar-documento",
    icon: <FileSearch className="h-8 w-8 text-[#4b7bb5]" />,
  },
  {
    title: "Extrator PDF",
    description: "Testar a extração de conteúdo de arquivos PDF",
    href: "/admin/ferramentas/pdf-extractor",
    icon: <FileWarning className="h-8 w-8 text-[#4b7bb5]" />,
  },
  {
    title: "Diagnóstico de Tarefas",
    description: "Verificar e diagnosticar problemas com tarefas de pastas",
    href: "/admin/ferramentas/diagnostico-tarefas",
    icon: <FolderSearch className="h-8 w-8 text-[#4b7bb5]" />,
  },
  {
    title: "Corrigir URLs",
    description: "Corrigir URLs de documentos para incluir a pasta do cliente",
    href: "/admin/ferramentas/corrigir-urls",
    icon: <FileCheck className="h-8 w-8 text-[#4b7bb5]" />,
  },
]

export default function ToolsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold text-[#4b7bb5] mb-6">Ferramentas Administrativas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <Link key={index} href={tool.href} className="block">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xl font-bold">{tool.title}</CardTitle>
                {tool.icon}
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-500">{tool.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
