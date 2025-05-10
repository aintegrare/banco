"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Settings,
  PenToolIcon as Tool,
  FolderOpen,
  FileSearch,
  Database,
  MessageSquare,
  FileText,
  Users,
} from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Blog",
    href: "/blog/admin",
    icon: FileText,
  },
  {
    title: "Documentos",
    href: "/admin/documentos",
    icon: FileSearch,
  },
  {
    title: "Arquivos",
    href: "/admin/arquivos",
    icon: FolderOpen,
  },
  {
    title: "Clientes",
    href: "/admin/clientes",
    icon: Users,
  },
  {
    title: "Ferramentas",
    href: "/admin/ferramentas",
    icon: Tool,
  },
  {
    title: "Configurações",
    href: "/admin/configuracoes",
    icon: Settings,
  },
  {
    title: "Embeddings",
    href: "/admin/configuracoes/embeddings",
    icon: Database,
  },
  {
    href: "/admin/configuracoes/chat",
    title: "Chat (Jaque)",
    icon: MessageSquare,
  },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item, index) => {
        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)

        return (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              isActive ? "bg-accent" : "transparent",
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}
