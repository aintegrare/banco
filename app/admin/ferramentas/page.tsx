import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { FileSearch, Link2, FolderSearch, FileWarning, FileCheck, Cloud, FileText, FolderOpen } from "lucide-react"

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
  {
    title: "Verificar Bunny CDN",
    description: "Diagnosticar conexão e configuração do Bunny CDN",
    href: "/admin/ferramentas/verificar-bunny",
    icon: <Cloud className="h-8 w-8 text-[#4b7bb5]" />,
  },
  {
    title: "Logs do Sistema",
    description: "Visualizar logs e atividades do sistema",
    href: "/admin/ferramentas/logs",
    icon: <FileText className="h-8 w-8 text-[#4b7bb5]" />,
  },
  {
    title: "Caminhos de Documentos",
    description: "Gerenciar e corrigir caminhos de documentos",
    href: "/admin/ferramentas/caminhos-documentos",
    icon: <FolderOpen className="h-8 w-8 text-[#4b7bb5]" />,
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[#f2f1ef]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#4b7bb5] mb-6">Ferramentas Administrativas</h1>
        <p className="text-gray-600 mb-8">
          Acesse ferramentas especializadas para diagnóstico, manutenção e configuração do sistema.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <Link key={index} href={tool.href} className="block">
              <Card className="h-full transition-all hover:shadow-lg hover:scale-105 border-l-4 border-l-[#4b7bb5]">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-lg font-bold text-[#4b7bb5]">{tool.title}</CardTitle>
                  {tool.icon}
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-gray-600">{tool.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
