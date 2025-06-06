"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  File,
  FolderOpen,
  Home,
  SearchCode,
  Settings,
  FileText,
  Handshake,
  CheckSquare,
  MessageSquare,
} from "lucide-react"

const navigation = [
  {
    title: "Principal",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: Home,
      },
      {
        title: "Projetos",
        href: "/admin/projetos",
        icon: BarChart3,
      },
      {
        title: "Tarefas",
        href: "/admin/tarefas",
        icon: CheckSquare,
      },
      {
        title: "Arquivos",
        href: "/admin/arquivos",
        icon: FolderOpen,
      },
      {
        title: "CRM",
        href: "/admin/crm",
        icon: Handshake,
      },
      {
        title: "Blog",
        href: "/admin/blog",
        icon: FileText,
      },
    ],
  },
  {
    title: "Avançado",
    items: [
      {
        title: "Documentos",
        href: "/admin/documentos",
        icon: File,
      },
      {
        title: "Ferramentas",
        href: "/admin/ferramentas",
        icon: SearchCode,
      },
      {
        title: "Configurações",
        href: "/admin/configuracoes",
        icon: Settings,
      },
      {
        title: "Chat",
        href: "/admin/chat",
        icon: MessageSquare,
      },
    ],
  },
]

export function AdminNavigation() {
  const pathname = usePathname()

  return (
    <div className="w-full">
      {navigation.map((group, i) => (
        <div key={i} className="px-3 py-2">
          <div className="mb-2 px-4 text-xs font-semibold text-muted-foreground">{group.title}</div>
          <div className="space-y-1">
            {group.items.map((item, i) => (
              <Link key={i} href={item.href}>
                <span
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-[#4b7bb5] hover:text-white",
                    pathname === item.href ? "bg-[#4b7bb5] text-white" : "transparent",
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
