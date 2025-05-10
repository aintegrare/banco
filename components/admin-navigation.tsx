"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, File, FolderOpen, Home, SearchCode, Settings, Users, FileText, Handshake } from "lucide-react"

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
        href: "/admin/projects",
        icon: BarChart3,
      },
      {
        title: "Arquivos",
        href: "/admin/files",
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
        title: "Busca",
        href: "/admin/search",
        icon: SearchCode,
      },
      {
        title: "Diagnósticos",
        href: "/admin/diagnostics",
        icon: File,
      },
      {
        title: "Configurações",
        href: "/admin/settings",
        icon: Settings,
      },
      {
        title: "Usuários",
        href: "/admin/users",
        icon: Users,
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
