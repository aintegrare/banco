"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { LayoutDashboard, FileText, FolderKanban, Settings, Search, Wrench, BarChart3 } from "lucide-react"

interface DockItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}

function DockItem({ href, icon, label, isActive }: DockItemProps) {
  return (
    <Link href={href} className="relative group">
      <div
        className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
          isActive ? "bg-[#4b7bb5] text-white" : "text-gray-600 hover:bg-[#4b7bb5]/10 hover:text-[#4b7bb5]"
        }`}
      >
        <div className="text-current">{icon}</div>
        <span className="text-xs mt-1 text-current">{label}</span>
      </div>
      {isActive && (
        <motion.div
          className="absolute -bottom-1 left-1/2 w-1.5 h-1.5 bg-white rounded-full"
          layoutId="activeIndicator"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          style={{ x: "-50%" }}
        />
      )}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {label}
      </div>
    </Link>
  )
}

export function AppDock() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm p-2 rounded-2xl shadow-lg border border-gray-200">
        <DockItem href="/" icon={<LayoutDashboard size={24} />} label="Dashboard" isActive={isActive("/")} />
        <DockItem
          href="/admin/arquivos"
          icon={<FileText size={24} />}
          label="Arquivos"
          isActive={isActive("/admin/arquivos")}
        />
        <DockItem
          href="/projetos"
          icon={<FolderKanban size={24} />}
          label="Projetos"
          isActive={isActive("/projetos")}
        />
        <DockItem href="/tarefas" icon={<BarChart3 size={24} />} label="Tarefas" isActive={isActive("/tarefas")} />
        <DockItem
          href="/admin/ferramentas"
          icon={<Wrench size={24} />}
          label="Ferramentas"
          isActive={isActive("/admin/ferramentas")}
        />
        <DockItem
          href="/admin/configuracoes"
          icon={<Settings size={24} />}
          label="Configurações"
          isActive={isActive("/admin/configuracoes")}
        />
        <DockItem href="/search" icon={<Search size={24} />} label="Busca" isActive={isActive("/search")} />
      </div>
    </div>
  )
}
